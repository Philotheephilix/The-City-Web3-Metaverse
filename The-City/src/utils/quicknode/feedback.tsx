'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { motion } from 'framer-motion'
import { Send, MessageSquare, ChevronDown } from 'lucide-react'

interface FeedbackComment {
  id: number;
  comment: string;
  category: string;
}

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
  result?: any;
}

const API_ENDPOINT = "https://api.quicknode.com/functions/rest/v1/functions/fc920253-0552-47f0-aa6c-b0659e6b497c/call";
const API_KEY = "QN_85c043ab59754b0d9afb25a8a8f51ce7";

async function fetchWithHeaders(action: 'submit' | 'list', data?: { category: string; comment: string }) {
  const headers = {
    'accept': 'application/json',
    'Content-Type': 'application/json',
    'x-api-key': API_KEY
  };

  const body = {
    network: "ethereum-mainnet",
    dataset: "block",
    blockNumber: 19532341,
    user_data: {
      action,
      userId: "12333",
      category: data?.category || (action === 'list' ? "hi" : 'g '),
      comment: data?.comment || (action === 'list' ? "bye" : ' g')
    }
  };

  try {
    const response = await fetch(`${API_ENDPOINT}?result_only=true`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

export default function FeedbackPage() {
  const [comment, setComment] = useState('')
  const [category, setCategory] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previousComments, setPreviousComments] = useState<FeedbackComment[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchPreviousComments = async () => {
    try {
      const response = await fetchWithHeaders('list');
      if (response.feedback) {
        const formattedComments = response.feedback.map((item: { data: { items: any } }) => {
          const feedbackData = item.data.items;
          console.log(feedbackData)
          return {
            id: feedbackData[0],
            category: feedbackData[2],
            comment: feedbackData[3]
          };
        });
        setPreviousComments(formattedComments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load previous comments');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPreviousComments();
    document.body.classList.add('dark');
    return () => {
      document.body.classList.remove('dark');
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim() || !category) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await fetchWithHeaders('submit', {
        comment: comment.trim(),
        category
      });

      // Check for various success indicators in the response
      if (result.success || result.result || (result.data && !result.error)) {
        toast.success('Feedback submitted successfully!');
        setComment('');
        setCategory('');
        // Wait a brief moment before refreshing the comments
        setTimeout(() => {
          fetchPreviousComments();
        }, 1000);
      } else {
        throw new Error(result.error || result.message || 'Failed to submit feedback');
      }
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoadMore = async () => {
    try {
      await fetchPreviousComments();
      toast.success('Comments refreshed');
    } catch (error) {
      console.error('Load more error:', error);
      toast.error('Failed to load more comments');
    }
  };

  // Input validation
  const isValidInput = comment.trim().length > 0 && category.length > 0;

  return (
    <div className="min-h-screen bg-black text-gray-300 p-8">
      <ToastContainer 
        theme="dark" 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
      />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-100">Government Feedback Portal</h1>
      </motion.div>

      <div className="max-w-4xl mx-auto">
        <Card className="mb-8 bg-black border-gray-300">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-100">Submit Your Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="comment" className="text-gray-300">Your Comment</Label>
                <Textarea
                  id="comment"
                  placeholder="Enter your feedback here..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  className="bg-black border-gray-700 text-gray-100 placeholder-gray-500"
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-gray-300">Category</Label>
                <Select 
                  value={category} 
                  onValueChange={setCategory} 
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="bg-black border-gray-700 text-gray-100 mb-7">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-black border-gray-700">
                    <SelectItem value="environment">Environment</SelectItem>
                    <SelectItem value="transportation">Transportation</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting || !isValidInput}
                className={`w-full ${
                  isValidInput 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-green-400 cursor-not-allowed'
                } text-white transition-colors duration-200`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2">⟳</span>
                    Submitting...
                  </span>
                ) : (
                  <span className="flex items-center">
                    Submit Feedback
                    <Send className="ml-2 h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-100">Previous Feedback</h2>
          {isLoading ? (
            <Card className="bg-black border-gray-400 p-4">
              <p className="text-center">Loading comments...</p>
            </Card>
          ) : previousComments.length === 0 ? (
            <Card className="bg-black border-gray-800 p-4">
              <p className="text-center">No comments yet. Be the first to leave feedback!</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {previousComments.map((item, index) => (
                <motion.div
                  key={item.id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="bg-gray-900 border-black">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <MessageSquare className="h-6 w-6 mt-1 text-blue-400" />
                        <div>
                          <p className="text-sm text-gray-500 mb-2">{item.category}</p>
                          <p className="text-gray-300">{item.comment}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      
    </div>
  )
}