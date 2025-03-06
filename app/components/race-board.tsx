'use client'

import { useActionState } from "react";
import { getRaceTableById } from "@/app/_actions/get-race-table";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";


export default function RaceBoard() {
  const [raceTable, action] = useActionState(getRaceTableById, [])
  const isFetched = raceTable.length > 0;
  console.log(raceTable)

  return (
    <>
      <form action={action} className="flex items-center space-x-3 bg-white shadow-sm rounded-lg p-4 border border-gray-200">
        <input 
          type="text" 
          name="raceId" 
          placeholder="Enter Race ID" 
          required 
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <Button type="submit">レース情報取得</Button>
      </form>

      {isFetched && (
        <div>

          <Table>
            <TableHeader>
              <TableRow>
                {Object.keys(raceTable[0]).map((colName) => (
                  <TableHead key={colName}>{colName}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {raceTable.map((row, idx) => (
                <TableRow key={idx}>
                  {Object.entries(row).map(([key, value]) => (
                    <TableHead key={key}>{value}</TableHead>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

      )}
    </>
  );
}