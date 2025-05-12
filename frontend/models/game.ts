type Boolean = {
    type: "Buffer";
    data: [1] | [0];
}

type Rating =
    "Overwhelmingly Positive" |
    "Very Positive" |
    "Mostly Positive" |
    "Positive" |
    "Mixed" |
    "Mostly Negative" |
    "Negative" |
    "Very Negative" |
    "Overwhelmingly Negative";

export type Game = {
    app_id: number;
    title: string;
    date_release: string;
    description: string;
    win: Boolean,
    mac: Boolean,
    linux: Boolean,
    steam_deck: Boolean,
    rating: Rating,
    positive_ratio: number;
    user_reviews: number;
    price_original: string;
};

export type Tag = {
    tag_id: number;
    label: string;
}

export type Review = {
    review_id: number;
    reviews: number;
    is_recommended: number;
    hours: string;
    date_published: string;
    username: string;
    user_id: number;
};