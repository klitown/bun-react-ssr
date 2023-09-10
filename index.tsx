import { renderToReadableStream } from "react-dom/server";
import Pokemon from "./components/Pokemon";
import PokemonList from "./components/PokemonList";
import Home from "./components/Home";

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(`${Bun.env.SUPABASE_URL}`, `${Bun.env.ANON_KEY}`);

Bun.serve({
    async fetch(request) {
        const url = new URL(request.url);

        if (url.pathname === "/") {

            const { data } = await supabase.from("tiendas").select();

            const stream = await renderToReadableStream(<Home tiendas={data} />);

            return new Response(stream, {
                headers: { "Content-Type": "text/html" },
            });
        }

        if (url.pathname === "/pokemon") {
            const response = await fetch("https://pokeapi.co/api/v2/pokemon");

            const { results } = (await response.json());

            const stream = await renderToReadableStream(<PokemonList pokemon={results} />);

            return new Response(stream, {
                headers: { "Content-Type": "text/html" },
            });
        }

        const pokemonNameRegex = /^\/pokemon\/([a-zA-Z0-9_-]+)$/;
        const match = url.pathname.match(pokemonNameRegex);

        if (match) {
            const pokemonName = match[1];

            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);

            if (response.status === 404) {
                return new Response("Not Found", { status: 404 });
            }

            const {
                height,
                name,
                weight,
                sprites: { front_default },
            } = (await response.json());

            const stream = await renderToReadableStream(<Pokemon name={name} height={height} weight={weight} img={front_default} />);

            return new Response(stream, {
                headers: { "Content-Type": "text/html" },
            });
        }

        return new Response("Not Found", { status: 404 });
    },
});

console.log("Listening ...");
