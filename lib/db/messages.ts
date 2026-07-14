import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from './helpers';
import type { Message } from '@/lib/types';

export interface ConversationSummary {
  partnerId: string;
  partnerName: string;
  partnerAvatar: string | null;
  messages: Message[];
  lastMessage: Message | null;
  unreadCount: number;
}

interface ConversationSummaryRow {
  partner_id: string;
  partner_name: string | null;
  partner_avatar: string | null;
  last_message_id: string | null;
  last_message_sender_id: string | null;
  last_message_receiver_id: string | null;
  last_message_booking_id: string | null;
  last_message_content: string | null;
  last_message_image_url: string | null;
  last_message_read: boolean | null;
  last_message_created_at: string | null;
  unread_count: number | null;
}

type DbMessage = {
  id: string;
  conversation_id: string;
  sender_profile_id: string;
  content: string | null;
  image_storage_path: string | null;
  created_at: string;
};

type Participant = {
  conversation_id: string;
  profile_id: string;
};

function toLegacyMessage(row: DbMessage, currentUserId: string, partnerId?: string): Message {
  const receiverId = row.sender_profile_id === currentUserId
    ? partnerId || ''
    : currentUserId;

  return {
    id: row.id,
    sender_id: row.sender_profile_id,
    receiver_id: receiverId,
    booking_id: null,
    content: row.content,
    image_url: row.image_storage_path,
    read: true,
    created_at: row.created_at,
  };
}

async function getParticipantConversationIds(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data, error } = await supabase
    .from('conversation_participants')
    .select('conversation_id')
    .eq('profile_id', userId);

  if (error || !data) return [];
  return data.map((row: { conversation_id: string }) => row.conversation_id);
}

async function findDirectConversationId(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  partnerId: string
) {
  const conversationIds = await getParticipantConversationIds(supabase, userId);
  if (conversationIds.length === 0) return null;

  const { data, error } = await supabase
    .from('conversation_participants')
    .select('conversation_id, profile_id')
    .in('conversation_id', conversationIds)
    .eq('profile_id', partnerId);

  if (error || !data || data.length === 0) return null;
  return data[0].conversation_id as string;
}

async function ensureDirectConversation(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  partnerId: string,
  bookingId?: string | null
) {
  const existingId = await findDirectConversationId(supabase, userId, partnerId);
  if (existingId) return existingId;

  const { data: conversation, error: conversationError } = await supabase
    .from('conversations')
    .insert({
      booking_id: bookingId || null,
      created_by_profile_id: userId,
      last_message_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (conversationError || !conversation) return null;

  const { error: ownerParticipantError } = await supabase
    .from('conversation_participants')
    .insert({ conversation_id: conversation.id, profile_id: userId });
  if (ownerParticipantError) return null;

  const { error: partnerParticipantError } = await supabase
    .from('conversation_participants')
    .insert({ conversation_id: conversation.id, profile_id: partnerId });
  if (partnerParticipantError) return null;

  return conversation.id as string;
}

export async function getConversations(userId: string): Promise<Message[]> {
  const messages = await getMessages(userId);
  const seen = new Set<string>();
  const conversations: Message[] = [];

  for (const message of messages) {
    const partnerId = message.sender_id === userId ? message.receiver_id : message.sender_id;
    if (!seen.has(partnerId)) {
      seen.add(partnerId);
      conversations.push(message);
    }
  }

  return conversations;
}

export async function getMessages(userId: string): Promise<Message[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = await createClient();
    const conversationIds = await getParticipantConversationIds(supabase, userId);
    if (conversationIds.length === 0) return [];

    const { data: participants } = await supabase
      .from('conversation_participants')
      .select('conversation_id, profile_id')
      .in('conversation_id', conversationIds);

    const partnerByConversation = new Map<string, string>();
    for (const participant of (participants || []) as Participant[]) {
      if (participant.profile_id !== userId) {
        partnerByConversation.set(participant.conversation_id, participant.profile_id);
      }
    }

    const { data, error } = await supabase
      .from('messages')
      .select('id, conversation_id, sender_profile_id, content, image_storage_path, created_at')
      .in('conversation_id', conversationIds)
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    return (data as DbMessage[]).map((row) => toLegacyMessage(row, userId, partnerByConversation.get(row.conversation_id)));
  } catch {
    return [];
  }
}

export async function getConversation(userId1: string, userId2: string): Promise<Message[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = await createClient();
    const conversationId = await findDirectConversationId(supabase, userId1, userId2);
    if (!conversationId) return [];

    const { data, error } = await supabase
      .from('messages')
      .select('id, conversation_id, sender_profile_id, content, image_storage_path, created_at')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error || !data) return [];
    return (data as DbMessage[]).map((row) => toLegacyMessage(row, userId1, userId2));
  } catch {
    return [];
  }
}

export async function sendMessage(
  messageData: Omit<Message, 'id' | 'created_at' | 'sender'>
): Promise<Message | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = await createClient();
    const conversationId = await ensureDirectConversation(
      supabase,
      messageData.sender_id,
      messageData.receiver_id,
      messageData.booking_id
    );
    if (!conversationId) return null;

    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_profile_id: messageData.sender_id,
        content: messageData.content,
        image_storage_path: messageData.image_url || null,
        message_type: messageData.image_url ? 'image' : 'text',
      })
      .select('id, conversation_id, sender_profile_id, content, image_storage_path, created_at')
      .single();

    if (error || !data) return null;

    await supabase
      .from('conversations')
      .update({ last_message_at: data.created_at })
      .eq('id', conversationId);

    return toLegacyMessage(data as DbMessage, messageData.sender_id, messageData.receiver_id);
  } catch {
    return null;
  }
}

export async function markAsRead(_userId: string, _partnerId: string): Promise<void> {
  // Canonical live schema tracks read state on conversation_participants.
  // The current legacy API surface does not expose per-message read updates.
}

export async function getConversationSummaries(userId: string): Promise<ConversationSummary[]> {
  if (!isSupabaseConfigured()) return [];

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc('get_message_conversation_summaries', {
      p_user_id: userId,
    });

    if (!error && Array.isArray(data)) {
      return (data as ConversationSummaryRow[]).map((row) => ({
        partnerId: row.partner_id,
        partnerName: row.partner_name || 'Korisnik',
        partnerAvatar: row.partner_avatar,
        messages: [],
        lastMessage: row.last_message_id
          ? {
              id: row.last_message_id,
              sender_id: row.last_message_sender_id || userId,
              receiver_id: row.last_message_receiver_id || row.partner_id,
              booking_id: row.last_message_booking_id,
              content: row.last_message_content,
              image_url: row.last_message_image_url,
              read: row.last_message_read ?? true,
              created_at: row.last_message_created_at || new Date(0).toISOString(),
            }
          : null,
        unreadCount: row.unread_count ?? 0,
      }));
    }

    const messages = await getMessages(userId);
    const grouped = new Map<string, Message[]>();

    for (const message of messages) {
      const partnerId = message.sender_id === userId ? message.receiver_id : message.sender_id;
      const existing = grouped.get(partnerId) || [];
      existing.push(message);
      grouped.set(partnerId, existing);
    }

    return Array.from(grouped.entries())
      .map(([partnerId, convoMessages]) => {
        const sorted = convoMessages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        return {
          partnerId,
          partnerName: 'Korisnik',
          partnerAvatar: null,
          messages: sorted,
          lastMessage: sorted[sorted.length - 1] || null,
          unreadCount: 0,
        };
      })
      .sort((a, b) => {
        const aTime = a.lastMessage ? new Date(a.lastMessage.created_at).getTime() : 0;
        const bTime = b.lastMessage ? new Date(b.lastMessage.created_at).getTime() : 0;
        return bTime - aTime;
      });
  } catch {
    return [];
  }
}
