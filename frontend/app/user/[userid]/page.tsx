'use client';

import { faker } from '@faker-js/faker';
import { useEffect, useState } from 'react';
import { Container, Divider, Title } from '@mantine/core';
import { useParams } from 'next/navigation';
import { config } from '../../../config';
import { Game } from '../../../models/game';
import { GamesGrid } from '../../../components/game';
import { IconUser } from '@tabler/icons-react';

export default function UserPage() {
    const { userid } = useParams();

    const [username, setUsername] = useState<string>("");
    const [games, setGames] = useState<Game[]>([]);

    useEffect(() => {
        faker.seed(parseInt(userid.toString()));
        setUsername(faker.internet.userName());

        fetch(`http://${config.server_host}:${config.server_port}/games_reviewed?user=${userid}`)
            .then(res => res.json())
            .then(data => setGames(data));
    }, []);

    return (
        <Container>
            <Title><IconUser /> {username}</Title>
            <Divider my='md' />
            <GamesGrid games={games} />
        </Container>
    );
}
