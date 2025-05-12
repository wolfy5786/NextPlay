'use client';

import { useEffect, useRef, useState } from 'react';
import { config } from '../config';
import { Game, Tag } from '../models/game';
import { GamesGrid } from '../components/game';
import { ActionIcon, AppShell, Badge, Burger, Divider, Group, rem, Skeleton, Text, TextInput, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ThemeToggle } from '../components/ThemeToggle';
import { IconArrowRight, IconHash, IconSearch } from '@tabler/icons-react';
import { theme } from '../theme';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function HomePage() {

  const [tags, setTags] = useState<Tag[]>([]);
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    fetch(`http://${config.server_host}:${config.server_port}/popular_tags`)
      .then(res => res.json())
      .then(data => setTags(data));

    fetch(`http://${config.server_host}:${config.server_port}/get_popular`)
      .then(res => res.json())
      .then(data => setGames(data));
  }, []);


  const [opened, { toggle }] = useDisclosure();

  const router = useRouter();
  const ref = useRef<HTMLInputElement>(null);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group justify="space-between" h="100%">
          <Group h="100%" px="md">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <Title order={1}>IGDB</Title>
          </Group>
          <Group h="100%" px="md">
            <TextInput
              ref={ref}
              radius="xl"
              size="md"
              placeholder="Search"
              rightSectionWidth={42}
              leftSection={<IconSearch style={{ width: rem(18), height: rem(18) }} stroke={1.5} />}
              rightSection={
                <ActionIcon size={32} radius="xl" color={theme.primaryColor} variant="filled" onClick={(e) => {
                  router.push(`/search/${ref.current?.value}`);
                }}>
                  <IconArrowRight style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
                </ActionIcon>
              }
            />
            <ThemeToggle />
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Text size='md'>Navbar</Text>
        {Array(15)
          .fill(0)
          .map((_, index) => (
            <Skeleton key={index} h={28} mt="sm" animate={false} />
          ))}
      </AppShell.Navbar>

      <AppShell.Main>
        <Group>
          <Group justify="space-between">
            {tags.map(tag => (
              <Link key={tag.tag_id} href={`/tag/${tag.tag_id}`}>
                <Badge
                  size="md"
                  variant="gradient"
                  gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
                  leftSection={<IconHash style={{ width: rem(12), height: rem(12) }} />}
                  onClick={() => { }}
                >
                  {tag.label}
                </Badge>
              </Link>
            ))}
          </Group>
          <Divider my='md' />
          <GamesGrid games={games} />
        </Group>
      </AppShell.Main>
    </AppShell>
  );

}
