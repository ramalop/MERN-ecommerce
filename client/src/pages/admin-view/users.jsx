import { getAllUsers } from '@/store/admin/user-slice'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const UsersForAdmin = () => {
    const{userList,isLoading}= useSelector((state)=>state.adminUsers)
    const dispatch = useDispatch()
    useEffect(()=>{
        dispatch(getAllUsers())
    },[dispatch])
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">All Users</h2>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : userList?.length > 0 ? (
              userList.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium">
                    {user.userName}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell className="capitalize">
                    {user.role}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default UsersForAdmin
