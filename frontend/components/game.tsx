import Link from "next/link";
import dayjs from "dayjs";
import { faker } from "@faker-js/faker";
import { IconHash } from '@tabler/icons-react';
import { Avatar, Badge, Button, Card, Container, Divider, Group, Image, LoadingOverlay, Paper, rem, SimpleGrid, Text, Title } from "@mantine/core";
import { Game, Tag, Review } from "../models/game";

export function GameCard(props: { game: Game }) {
    const { game } = props;
    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
                <Image
                    src={`https://cdn.akamai.steamstatic.com/steam/apps/${game.app_id}/header.jpg`}
                    height={160}
                    alt={game.title}
                />
            </Card.Section>

            <Group justify="space-between" mt="md" mb="xs">
                <Text fw={500}>{game.title}</Text>
                <Badge color="pink">{game.rating}</Badge>
            </Group>

            <Text flex="auto" size="sm" c="dimmed">
                {game.description}
            </Text>

            <Link href={`/game/${game.app_id}`}>
                <Button color="blue" fullWidth mt="md" radius="md">
                    Buy
                </Button>
            </Link>
        </Card>
    );
}

export function GamesGrid(props: { games: Game[] }) {
    const { games } = props;
    return (
        <SimpleGrid
            p="md"
            cols={{ base: 1, sm: 2, lg: 3 }}
            spacing={{ base: 10, sm: 'xl' }}
            verticalSpacing={{ base: 'md', sm: 'xl' }}
        >
            {games.map(game => <GameCard key={game.app_id} game={game} />)}
        </SimpleGrid>
    );
}

export function GameSection(props: { game: Game | null, tags: Tag[], reviews: Review[] }) {
    const { game, tags, reviews } = props;
    return (
        <Container>
            <Group display={game ? 'block' : 'none'}>
                <Title>{game?.title}</Title>
                <Divider my='md' />
                <Image w="100%" src={`https://cdn.akamai.steamstatic.com/steam/apps/${game?.app_id}/header.jpg`} alt={game?.title} />
                <Group justify="space-between" mt="md" mb="xs">
                    <Text fw={500}>${game?.price_original}</Text>
                    <Badge color="pink">{game?.rating}</Badge>
                </Group>
                <Text ta='justify'>{game?.description}</Text>
                <Divider my='md' />
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
                <SimpleGrid
                    p="md"
                    cols={{ base: 1, sm: 2, lg: 3 }}
                    spacing={{ base: 10, sm: 'xl' }}
                    verticalSpacing={{ base: 'md', sm: 'xl' }}
                >
                    {reviews.map(review => {
                        faker.seed(review.user_id);
                        const isRecommended = review.is_recommended == 1;
                        const username = review.username ?? faker.internet.userName();
                        const profile = `https://api.dicebear.com/8.x/pixel-art/svg?seed=${username}`;
                        const hours = parseFloat(review.hours);
                        const date = new Date(review.date_published);
                        const id = review.review_id;

                        return (
                            <Link key={id} href={`/user/${id}`}>
                                <Paper radius="md" withBorder p="lg" bg="var(--mantine-color-body)">
                                    <Text ta="left" c="dimmed" fz="sm">{dayjs(date).toString()}</Text>

                                    <Avatar src={profile} size={120} radius={120} mx="auto" />
                                    <Text ta="center" fz="lg" fw={500} mt="md">{username}</Text>
                                    <Text ta="center" c="dimmed" fz="sm">{hours} hrs</Text>

                                    <Divider my='md' />

                                    <Text ta="right" fz="md" c={isRecommended ? 'green' : 'red'}>{isRecommended ? "RECOMMENDED 👍" : "NOT RECOMMENDED 👎"}</Text>
                                </Paper>
                            </Link>
                        );
                    })}
                </SimpleGrid>
            </Group>
            <LoadingOverlay visible={!game} />
        </Container >
    );
}