'use client'

// import {
//     Form,
//     FormControl,
//     FormDescription,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage,
//   } from "@/components/ui/form"


// import { getRaceTableById } from "@/app/_api/race-table/route";
import { Button } from "@/components/ui/button";

export default function RaceForm() {
    const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const raceId = formData.get('raceId') as string;

        // validation zod使うかな

        // raceTable取得

        const res = await fetch(`/api/race-table?raceId=${raceId}`)
        const { data } = await res.json();

        console.log(data, 'from clinet');
        // if (raceId) {
        //     const table = await getRaceTableById(raceId);
        //     console.log(table, 'from client');
        //     // Handle the table data as needed
        // }
    }

    return (
        <form onSubmit={submitHandler}>
            <input type="text" name="raceId" placeholder="Enter Race ID" required />
            <Button type="submit">レース情報取得</Button>
        </form>
    );
}