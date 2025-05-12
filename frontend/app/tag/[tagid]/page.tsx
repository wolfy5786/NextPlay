'use client';

import { useEffect, useState } from 'react';
import { Container, Divider, Title } from '@mantine/core';
import { useParams } from 'next/navigation';
import { config } from '../../../config';
import { Game } from '../../../models/game';
import { GamesGrid } from '../../../components/game';
import { IconHash } from '@tabler/icons-react';

export default function TagPage() {
    const { tagid } = useParams();

    const [title, setTitle] = useState<string>("");
    const [games, setGames] = useState<Game[]>([]);

    useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/tag_label?tagid=${tagid}`)
            .then(res => res.json())
            .then(data => setTitle(data));

        fetch(`http://${config.server_host}:${config.server_port}/tag_games?tagid=${tagid}`)
            .then(res => res.json())
            .then(data => setGames(data));
    }, []);

    return (
        <Container>
            <Title><IconHash /> {title}</Title>
            <Divider my='md' />
            <GamesGrid games={games} />
        </Container>
    );
}
