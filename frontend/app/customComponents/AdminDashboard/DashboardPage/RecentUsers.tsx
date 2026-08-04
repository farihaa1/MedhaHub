"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Badge } from "@/components/ui/badge"

const users = [
  {
    id: 1,
    name: "Rahim Ahmed",
    email: "rahim@gmail.com",
    type: "Premium",
    joined: "Today",
  },

  {
    id: 2,
    name: "Nabila Islam",
    email: "nabila@gmail.com",
    type: "Free",
    joined: "Yesterday",
  },

  {
    id: 3,
    name: "Karim Hasan",
    email: "karim@gmail.com",
    type: "Premium",
    joined: "2 days ago",
  },

  {
    id: 4,
    name: "Sadia Akter",
    email: "sadia@gmail.com",
    type: "Free",
    joined: "3 days ago",
  },
]

export default function RecentUsers() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Users</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>

                <TableHead>Email</TableHead>

                <TableHead>Type</TableHead>

                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>

                  <TableCell>{user.email}</TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        user.type === "Premium" ? "default" : "secondary"
                      }
                    >
                      {user.type}
                    </Badge>
                  </TableCell>

                  <TableCell>{user.joined}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
