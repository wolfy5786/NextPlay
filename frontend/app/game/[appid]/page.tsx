'use client'

import { useFetch } from "@mantine/hooks";
import { useParams } from "next/navigation";
import { Game, Tag, Review } from "../../../models/game";
import { config } from "../../../config";
import { GameSection } from "../../../components/game";

export default function GamePage() {
    const { appid } = useParams();

    const game = useFetch<Game>(
        `http://${config.server_host}:${config.server_port}/game?app_id=${appid}`
    );

    const tags = useFetch<Tag[]>(
        `http://${config.server_host}:${config.server_port}/game_tags?app_id=${appid}`
    );

    const reviews = useFetch<Review[]>(
        `http://${config.server_host}:${config.server_port}/get_recommend?app_id=${appid}`
    );

    return (
        <GameSection game={game.data} tags={tags.data ?? []} reviews={reviews.data ?? []} />
    );
}