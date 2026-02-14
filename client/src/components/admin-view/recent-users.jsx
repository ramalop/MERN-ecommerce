import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';


const RecentUsersForAdmin = ({recentUsers}) => {
  const navigate=useNavigate()
  return (
     <div className="rounded-xl border p-4 bg-background overflow-x-auto">
      <h2 className="text-lg font-semibold mb-4">
        Recent Users
      </h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User Name</TableHead>
            <TableHead>Email ID</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {recentUsers.map((user) => (
            <TableRow key={user._id}>
              <TableCell className="font-medium">
                {user.userName}
              </TableCell>
              <TableCell>
                {user.email}
              </TableCell>
              <TableCell>
                {user.role}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex w-full items-center justify-center"><Button onClick={()=>navigate("/admin/users")}>View all Users</Button></div>
      
    </div>
  )
}

export default RecentUsersForAdmin
