"use client"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from 'react'
import { Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('anonAadhaar');
        const user = storedUser ? JSON.parse(storedUser) : {};
        setIsLoggedIn(user && user.status === 'logged-in');
    }, []);

    const handleLogin = () => {
        navigate('/Login');
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('anonAadhaar');
        setIsLoggedIn(false);
        navigate('/Login');
    };

    return (
        <div className={`flex flex-col dark`}>
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center">
                    <Button variant="ghost" size="icon" className="md:hidden mr-2">
                        <Menu className="h-5 w-5" />
                    </Button>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">CityVerse Dashboard</h1>
                </div>
                <div className="flex items-center space-x-4">
                    
                    {isLoggedIn ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src="/placeholder-user.jpg" alt="User" />
                                        <AvatarFallback className="text-white">S</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{localStorage.getItem('username')}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button onClick={handleLogin}>Login</Button>
                    )}
                </div>
            </div>
        </header>
        </div>
    );
}
