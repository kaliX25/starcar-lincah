import React, { useEffect, useRef, useState } from 'react';
import { View, ScrollView, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { T, Chip, Row, Ionicons, Pill } from '../ui';
import { useTheme, pf } from '../theme';
import { useStore } from '../store';
import { api } from '../api';
import RecCard from '../RecCard';
import { recommend, isComplete, Q } from '../../shared/lincah';
import { uid } from '../util';

const GREETING = {
  id: 'g0', role: 'assistant',
  text: 'Halo, aku Bintang, asisten AI Star Car. Aku bantu pilih mobil, cicilan, dan charging yang pas. Biasanya sehari kamu menempuh berapa kilometer?',
  quick: Q.km.quick,
};

export default function Advisor() {
  const { state, dispatch } = useStore();
  const th = useTheme();
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState(null);
  const scroll = useRef(null);

  useEffect(() => {
    if (state.hydrated && state.messages.length === 0) dispatch({ type: 'MSG', msgs: [GREETING] });
  }, [state.hydrated, state.messages.length]);

  useEffect(() => { setTimeout(() => scroll.current && scroll.current.scrollToEnd({ animated: true }), 80); }, [state.messages.length, busy]);

  const send = async (raw) => {
    const t = (raw ?? text).trim();
    if (!t || busy) return;
    setText('');
    const userMsg = { id: uid(), role: 'user', text: t };
    dispatch({ type: 'MSG', msgs: [userMsg] });
    setBusy(true);
    const history = [...state.messages, userMsg].filter((m) => m.role === 'user' || m.role === 'assistant').map((m) => ({ role: m.role, content: m.text }));
    const res = await api.advisor(history, state.profile);
    setMode(res.mode);
    const profile = { ...state.profile, ...res.profile };
    dispatch({ type: 'PROFILE', profile: res.profile || {} });
    const msgs = [{ id: uid(), role: 'assistant', text: res.reply, quick: res.quick }];
    if (isComplete(profile)) {
      const rec = recommend(profile);
      if (!state.rec || state.rec.modelId !== rec.modelId) msgs.push({ id: uid(), role: 'rec' });
      dispatch({ type: 'REC', rec });
    }
    dispatch({ type: 'MSG', msgs });
    setBusy(false);
  };

  const last = [...state.messages].reverse().find((m) => m.role === 'assistant');
  const lastIsLast = state.messages.length && state.messages[state.messages.length - 1].role === 'assistant';

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={{ paddingHorizontal: 20, paddingTop: 18, paddingBottom: 10, flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: th.primary, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="sparkles" size={20} color={th.primaryInk} />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <T v="title" style={{ fontSize: 22, lineHeight: 26 }}>Bintang</T>
          <View style={{ marginTop: 2 }}>
            <Pill label={mode === 'claude' ? 'Ditenagai Claude' : mode === 'offline' ? 'Mode offline' : 'AI advisor'} tone={mode === 'offline' ? 'mute' : 'primary'} />
          </View>
        </View>
        {state.messages.length > 1 ? (
          <Pressable onPress={() => dispatch({ type: 'RESET_CHAT' })} hitSlop={10}><Ionicons name="refresh" size={22} color={th.sub} /></Pressable>
        ) : null}
      </View>

      <ScrollView ref={scroll} contentContainerStyle={{ padding: 20, paddingBottom: 16 }} showsVerticalScrollIndicator={false}>
        {state.messages.map((m) => {
          if (m.role === 'rec') return state.rec ? <RecCard key={m.id} rec={state.rec} /> : null;
          const mine = m.role === 'user';
          return (
            <View key={m.id} style={{ alignItems: mine ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
              <View style={{ maxWidth: '86%', backgroundColor: mine ? th.primary : th.surface, borderRadius: 20, borderBottomRightRadius: mine ? 6 : 20, borderBottomLeftRadius: mine ? 20 : 6, paddingVertical: 12, paddingHorizontal: 16, boxShadow: mine ? undefined : `0 4px 16px ${th.shadow}` }}>
                <T v="body" color={mine ? th.primaryInk : th.ink}>{m.text}</T>
              </View>
            </View>
          );
        })}
        {busy ? (
          <View style={{ alignItems: 'flex-start', marginBottom: 10 }}>
            <View style={{ backgroundColor: th.surface, borderRadius: 20, borderBottomLeftRadius: 6, paddingVertical: 12, paddingHorizontal: 18 }}>
              <T v="body" sub>Bintang sedang mengetik…</T>
            </View>
          </View>
        ) : null}
        {!busy && lastIsLast && last && last.quick && last.quick.length ? (
          <Row style={{ marginTop: 4 }}>{last.quick.map((q) => <Chip key={q} label={q} tone="ghost" onPress={() => send(q)} />)}</Row>
        ) : null}
      </ScrollView>

      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12, paddingHorizontal: 16, backgroundColor: th.bg }}>
        <TextInput
          value={text} onChangeText={setText} onSubmitEditing={() => send()} returnKeyType="send"
          placeholder="Ketik pesan…" placeholderTextColor={th.sub}
          style={{ flex: 1, backgroundColor: th.surface, color: th.ink, borderRadius: 22, paddingVertical: 12, paddingHorizontal: 18, fontSize: 15, fontFamily: pf(400), boxShadow: `0 2px 10px ${th.shadow}` }}
        />
        <Pressable onPress={() => send()} style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: th.primary, alignItems: 'center', justifyContent: 'center', marginLeft: 10, opacity: text.trim() && !busy ? 1 : 0.5 }}>
          <Ionicons name="arrow-up" size={22} color={th.primaryInk} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
