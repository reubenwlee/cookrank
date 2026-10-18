import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { RECIPE_BY_ID } from '@/data/recipes';
import type { Post } from '@/data/seed';
import { tierFor } from '@/game/rules';
import { timeAgo } from '@/game/view';
import { ME, useStore } from '@/store/store';
import { Icon } from './Icon';
import { Avatar } from './kit';
import { photoSource } from './photos';
import { useColors } from './theme';

export function PostCard({ post, onComments, full }: { post: Post; onComments?: () => void; full?: boolean }) {
  const c = useColors();
  const { state, dispatch } = useStore();
  const user = state.users[post.userId];
  const recipe = RECIPE_BY_ID[post.recipeId];
  const liked = state.liked.includes(post.id);
  const comments = state.comments.filter((x) => x.postId === post.id);
  const openUser = () => router.push(post.userId === ME ? '/profile' : `/user/${post.userId}`);
  if (!user || !recipe) return null;

  return (
    <View style={{ paddingTop: 6, paddingBottom: 20 }}>
      <View style={s.head}>
        <Pressable onPress={openUser}>
          <Avatar photo={user.avatar} name={user.name} size={36} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text onPress={openUser} style={{ fontSize: 15, fontWeight: '600', color: c.ink }}>{user.handle}</Text>
          <Text
            onPress={() => router.push(post.userId === ME ? `/recipe/${recipe.id}` : `/recipe/${recipe.id}?user=${post.userId}`)}
            style={{ fontSize: 13, color: c.ink2 }}
          >
            {recipe.name} · {tierFor(post.cookNumber).name} · Cook #{post.cookNumber}
          </Text>
        </View>
      </View>
      <Pressable onPress={full ? undefined : () => router.push(`/post/${post.id}`)} onLongPress={() => dispatch({ type: 'like', postId: post.id })}>
        <Image source={photoSource(post.photo)} style={{ width: '100%', aspectRatio: 4 / 5, backgroundColor: c.raised }} contentFit="cover" transition={150} />
      </Pressable>
      <View style={s.acts}>
        <Pressable accessibilityLabel={liked ? 'Unlike' : 'Like'} hitSlop={10} onPress={() => dispatch({ type: 'like', postId: post.id })}>
          <Icon name="heart" size={26} color={liked ? c.accent : c.ink} fill={liked ? c.accent : undefined} />
        </Pressable>
        <Pressable accessibilityLabel="Comments" hitSlop={10} onPress={onComments ?? (() => router.push(`/post/${post.id}`))}>
          <Icon name="bubble" size={26} color={c.ink} />
        </Pressable>
        {post.userId !== ME && (
          <Pressable accessibilityLabel="Message" hitSlop={10} onPress={() => router.push(`/messages/${post.userId}`)}>
            <Icon name="send" size={26} color={c.ink} />
          </Pressable>
        )}
      </View>
      <Text style={[s.likes, { color: c.ink }]}>{post.likes.toLocaleString()} like{post.likes === 1 ? '' : 's'}</Text>
      {post.description ? (
        <Text style={[s.cap, { color: c.ink }]}>
          <Text style={{ fontWeight: '600' }}>{user.handle}</Text> {post.description}
        </Text>
      ) : null}
      {!full && comments.length > 0 && (
        <Text onPress={onComments ?? (() => router.push(`/post/${post.id}`))} style={[s.cap, { color: c.ink2 }]}>
          View {comments.length === 1 ? '1 comment' : `all ${comments.length} comments`}
        </Text>
      )}
      <Text style={[s.when, { color: c.ink2 }]}>{timeAgo(post.createdAt)}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingTop: 8, paddingBottom: 10 },
  acts: { flexDirection: 'row', gap: 18, paddingHorizontal: 16, paddingTop: 12 },
  likes: { fontSize: 15, fontWeight: '600', paddingHorizontal: 16, paddingTop: 8 },
  cap: { fontSize: 15, lineHeight: 20, paddingHorizontal: 16, paddingTop: 4 },
  when: { fontSize: 12, paddingHorizontal: 16, paddingTop: 4 },
});
