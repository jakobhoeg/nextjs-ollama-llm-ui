import React from 'react'
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Button } from '../ui/button'
import { ChevronDown } from 'lucide-react'
  

export default function ChatTopbar() {
  return (
    <div className='w-full flex px-4 py-6  items-center justify-center '>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className='flex gap-2 items-center'>
            phi
            <ChevronDown size={18} />
            </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Models</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
        >
          llama2
        </DropdownMenuCheckboxItem>
       
        <DropdownMenuCheckboxItem
          
        >
          Panel
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  


    </div>
  )
}
