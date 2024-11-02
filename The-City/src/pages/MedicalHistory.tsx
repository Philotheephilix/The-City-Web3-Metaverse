"use client"

import { useState, useEffect } from 'react'
import { FileText, Image as ImageIcon, PlusCircle, Share2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { QRCodeCanvas } from 'qrcode.react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import axios from 'axios'
import { API_URL } from '@/constants'

type MedicalRecord = {
  id: string
  name: string
  date: string
  type: string
  size: string
  content?: string
  imageUrl?: string
  userId:String
}


export default function CreativeMedicalRecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [newTextRecord, setNewTextRecord] = useState({ title: '', content: '' })
  const [showQR, setShowQR] = useState(false)
  let anonid = localStorage.getItem('userId')?localStorage.getItem('userId'):"";

  const handleTextRecordSubmit = async () => {
    if (newTextRecord.title && newTextRecord.content) {
      const newRecord: MedicalRecord = {
        id: Date.now().toString(),
        name: newTextRecord.title,
        date: new Date().toISOString().split('T')[0],
        type: 'TEXT',
        size: `${newTextRecord.content.length} chars`,
        content: newTextRecord.content,
        userId:anonid?anonid:"",
      }
      await axios.post(`${API_URL}/med`,newRecord);
      setRecords([...records, newRecord])
      setNewTextRecord({ title: '', content: '' })
    }
  }

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.post(`${API_URL}/medi`,{anonid:anonid});
        const data = await response.data;
        setRecords(data);
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    };

    fetchRecords();
  }, []);

  return (
    <div className="  px-48 py-8 relative bg-black">
      <motion.h1 
        className="text-4xl font-bold mb-6 text-white text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Your Health Journey
      </motion.h1>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Alert className="mb-3 bg-gradient-to-r from-blue-700 to-purple-500 text-white border-none">
          <AlertTitle className="text-lg font-semibold">Welcome to Your Health Hub</AlertTitle>
          <AlertDescription>
            Manage your medical records securely and access them anytime, anywhere.
          </AlertDescription>
        </Alert>
      </motion.div>

      <Tabs defaultValue="file" className="mb-6">
        <TabsList className="grid w-full grid-cols-3 bg-black-900 p-8 flex justify-around">
          <TabsTrigger value="file">File Upload</TabsTrigger>
          <TabsTrigger value="text">Text Record</TabsTrigger>
          <TabsTrigger value="image">Image Upload</TabsTrigger>
        </TabsList>
        <TabsContent value="file">
          <Card className=" bg-black text-white">
            <CardHeader>
              <CardTitle>Development under Progress</CardTitle>
            </CardHeader>
          </Card>
        </TabsContent>
        <TabsContent value="text">
          <Card className="bg-black text-white">
            <CardHeader>
              <CardTitle>Add New Text Record</CardTitle>
              <CardDescription>Create a new text-based medical record</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid w-full gap-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="text-record-title">Record Title</Label>
                  <Input 
                    id="text-record-title" 
                    value={newTextRecord.title}
                    onChange={(e) => setNewTextRecord({...newTextRecord, title: e.target.value})}
                    placeholder="Enter record title"
                  />
                </div>
                <div className="grid w-full gap-1.5">
                  <Label htmlFor="text-record-content">Record Content</Label>
                  <Textarea 
                    id="text-record-content"
                    value={newTextRecord.content}
                    onChange={(e) => setNewTextRecord({...newTextRecord, content: e.target.value})}
                    placeholder="Enter medical record details"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter  className='flex justify-center'>
              <Button onClick={handleTextRecordSubmit}><PlusCircle className="mr-2 h-4 w-4" /> Add Text Record</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="image">
          <Card className="bg-black text-white">
          <CardHeader>
              <CardTitle>Development under Progress</CardTitle>
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="mb-6 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-green-400 to-blue-500 text-white">
          <CardTitle>Your Medical Records</CardTitle>
          <CardDescription className="text-gray-100">View and manage your uploaded medical records</CardDescription>
        </CardHeader>
        <CardContent className='bg-black text-white'>
          <ScrollArea className="  rounded-md ">
            <Table className=''>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Name</TableHead>
                  <TableHead className="text-center">Date</TableHead>
                  <TableHead className="text-center">Type</TableHead>
                  <TableHead className="text-center">Size</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.name}</TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.type}</TableCell>
                    <TableCell>{record.size}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" className='bg-black' size="icon">
                              {record.type === 'IMAGE' ? <ImageIcon className="h-4 w-4 " /> : <FileText className="h-4 w-4 " />}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>{record.name}</DialogTitle>
                              <DialogDescription>
                                View details of your medical record.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              {record.type === 'IMAGE' && record.imageUrl && (
                                <img src={record.imageUrl} alt={record.name} className="w-full h-auto rounded-lg" />
                              )}
                              {record.type === 'TEXT' && record.content && (
                                <p className="text-sm">{record.content}</p>
                              )}
                              {!record.content && !record.imageUrl && (
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="name" className="text-right">
                                    Name
                                  </Label>
                                  <Input id="name" value={record.name} className="col-span-3" readOnly />
                                </div>
                              )}
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="date" className="text-right">
                                  Date
                                </Label>
                                <Input id="date" value={record.date} className="col-span-3" readOnly />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="type" className="text-right">
                                  Type
                                </Label>
                                <Input id="type" value={record.type} className="col-span-3" readOnly />
                              </div>
                              
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="size" className="text-right">
                                  Size
                                </Label>
                                <Input id="size" value={record.size} className="col-span-3" readOnly />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button type="submit" >Download</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="flex justify-center mb-6">
        <Button 
          onClick={() => setShowQR(true)}
          className="border-none bg-gradient-to-r from-pink-500 to-yellow-600 hover:from-pink-600 hover:to-yellow-600 text-white"
        >
          <Share2 className="mr-2 h-4 w-4" />
          Share Your Health Journey
        </Button>
      </div>

      {showQR && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowQR(false)}
        >
          <div className="bg-black p-6 rounded-lg flex flex-col items-center align-center justify-center text-center" onClick={e => e.stopPropagation()}>
            <h2 className="text-2xl text-white font-bold mb-4">Share Your Health Journey</h2>
            <QRCodeCanvas value="https://cityverse-health.example.com/share" size={200} />
            <p className="mt-4 text-lg text-white font-semibold">Scan Me</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}