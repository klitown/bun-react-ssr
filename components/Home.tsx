import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const supabase = createClient(`${Bun.env.SUPABASE_URL}`, `${Bun.env.ANON_KEY}`);

function Home({ tiendas }: any) {


    return (
        <html>
            <head>
                <meta charSet="UTF-8" />
                <script src="https://cdn.tailwindcss.com"></script>
            </head>
            <body className="h-screen bg-gray-100 flex flex-col justify-center items-center">
                <h1 className="font-bold text-3xl">
                    Using Bun HTTP Server with React & SSR
                </h1>
                <ul>
                    {tiendas.map((tienda: any) => (
                        <li key={tienda.id}>
                            ID from server: {tienda.id}
                        </li>
                    ))}
                </ul>
            </body>
        </html>
    );
}

export default Home;