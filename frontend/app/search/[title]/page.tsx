'use client';

import { useEffect, useState } from 'react';
import { Container, Divider, Title } from '@mantine/core';
import { useParams } from 'next/navigation';
import { config } from '../../../config';
import { Game } from '../../../models/game';
import { GamesGrid } from '../../../components/game';
import { IconSearch } from '@tabler/icons-react';

export default function SearchPage() {
    const { title } = useParams();

    const [games, setGames] = useState<Game[]>([]);

    useEffect(() => {
        fetch(`http://${config.server_host}:${config.server_port}/search_games?title=${title}`)
            .then(res => res.json())
            .then(data => setGames(data));
    }, []);

    return (
        <Container>
            <Title><IconSearch /> {title}</Title>
            <Divider my='md' />
            <GamesGrid games={games} />
        </Container>
    );
}
