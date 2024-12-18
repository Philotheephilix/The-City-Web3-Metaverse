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
import { Send, MessageSquare } from 'lucide-react'

interface FeedbackComment {
  id: number;
  comment: string;
  category: string;
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
          <CardHeader className='flex flex-row justify-evenly'>
            <div className='w-[max-content] flex flex-row align-center top-0 right-0 m-2 border border-slate-600 rounded p-2 bg-grey-800'>
              <svg width="38" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_2118_1944)"><path d="M40.2113 12.0496C40.2113 12.5028 40.1648 12.9372 40.0719 13.353C39.9791 13.7641 39.8444 14.1495 39.668 14.5092C39.4961 14.8689 39.2849 15.2006 39.0341 15.5042C38.7834 15.8032 38.4978 16.0671 38.1774 16.296L40.7337 19.0989H39.1873C38.9645 19.0989 38.7625 19.0685 38.5814 19.0078C38.4049 18.9471 38.2424 18.835 38.0938 18.6715L36.6171 17.0318C36.3803 17.0972 36.1365 17.1462 35.8858 17.1789C35.6396 17.2116 35.3819 17.228 35.1126 17.228C34.351 17.228 33.6545 17.0995 33.023 16.8426C32.3961 16.581 31.8574 16.2189 31.407 15.7565C30.9612 15.294 30.6153 14.7474 30.3692 14.1168C30.1231 13.4815 30 12.7924 30 12.0496C30 11.3069 30.1231 10.6202 30.3692 9.98952C30.6153 9.35419 30.9612 8.80529 31.407 8.34282C31.8574 7.88034 32.3961 7.52064 33.023 7.2637C33.6545 7.0021 34.351 6.8713 35.1126 6.8713C35.8741 6.8713 36.5684 7.0021 37.1952 7.2637C37.8221 7.52531 38.3585 7.88735 38.8042 8.34982C39.25 8.80763 39.596 9.35419 39.8421 9.98952C40.0882 10.6202 40.2113 11.3069 40.2113 12.0496ZM38.2888 12.0496C38.2888 11.4937 38.2145 10.9962 38.0659 10.5571C37.922 10.1133 37.713 9.73726 37.439 9.42894C37.1651 9.12062 36.8307 8.88471 36.436 8.72121C36.046 8.55771 35.6048 8.47595 35.1126 8.47595C34.6204 8.47595 34.1769 8.55771 33.7822 8.72121C33.3875 8.88471 33.0508 9.12062 32.7722 9.42894C32.4983 9.73726 32.287 10.1133 32.1384 10.5571C31.9898 10.9962 31.9155 11.4937 31.9155 12.0496C31.9155 12.6055 31.9898 13.1054 32.1384 13.5492C32.287 13.9883 32.4983 14.362 32.7722 14.6703C33.0508 14.974 33.3875 15.2076 33.7822 15.3711C34.1769 15.5346 34.6204 15.6163 35.1126 15.6163C35.6048 15.6163 36.046 15.5346 36.436 15.3711C36.8307 15.2076 37.1651 14.974 37.439 14.6703C37.713 14.362 37.922 13.9883 38.0659 13.5492C38.2145 13.1054 38.2888 12.6055 38.2888 12.0496Z" fill="var(--color--text--standard)"></path><path d="M42.6116 9.92645V14.4952C42.6116 14.9343 42.7114 15.2753 42.9111 15.5182C43.1154 15.7565 43.4196 15.8756 43.8236 15.8756C44.1208 15.8756 44.3994 15.8102 44.6594 15.6794C44.9195 15.5439 45.1656 15.3594 45.3977 15.1258V9.92645H47.1182V17.1159H46.0664C45.8435 17.1159 45.6973 17.0108 45.6276 16.8005L45.5092 16.226C45.3606 16.3754 45.2074 16.5132 45.0495 16.6394C44.8916 16.7608 44.7221 16.8659 44.541 16.9547C44.3645 17.0388 44.1718 17.1042 43.9629 17.1509C43.7586 17.2023 43.538 17.228 43.3012 17.228C42.9111 17.228 42.5652 17.1626 42.2633 17.0318C41.9661 16.8963 41.7154 16.7071 41.5111 16.4642C41.3067 16.2213 41.1512 15.934 41.0444 15.6023C40.9422 15.266 40.8911 14.8969 40.8911 14.4952V9.92645H42.6116Z" fill="var(--color--text--standard)"></path><path d="M50.2298 9.92645V17.1159H48.5093V9.92645H50.2298ZM50.4875 7.83129C50.4875 7.98078 50.4573 8.12092 50.3969 8.25172C50.3366 8.38252 50.2553 8.49698 50.1531 8.59508C50.0556 8.69318 49.9395 8.77259 49.8049 8.83332C49.6702 8.88938 49.5263 8.91741 49.373 8.91741C49.2244 8.91741 49.0828 8.88938 48.9481 8.83332C48.8181 8.77259 48.7043 8.69318 48.6068 8.59508C48.5093 8.49698 48.4304 8.38252 48.37 8.25172C48.3143 8.12092 48.2864 7.98078 48.2864 7.83129C48.2864 7.67713 48.3143 7.53231 48.37 7.39684C48.4304 7.26137 48.5093 7.14458 48.6068 7.04648C48.7043 6.94838 48.8181 6.8713 48.9481 6.81524C49.0828 6.75451 49.2244 6.72415 49.373 6.72415C49.5263 6.72415 49.6702 6.75451 49.8049 6.81524C49.9395 6.8713 50.0556 6.94838 50.1531 7.04648C50.2553 7.14458 50.3366 7.26137 50.3969 7.39684C50.4573 7.53231 50.4875 7.67713 50.4875 7.83129Z" fill="var(--color--text--standard)"></path><path d="M56.6447 11.447C56.5936 11.5124 56.5425 11.5638 56.4914 11.6012C56.445 11.6386 56.3753 11.6572 56.2825 11.6572C56.1942 11.6572 56.1083 11.6315 56.0247 11.5802C55.9412 11.5241 55.8413 11.4634 55.7252 11.398C55.6091 11.3279 55.4698 11.2672 55.3073 11.2158C55.1494 11.1597 54.9521 11.1317 54.7153 11.1317C54.4134 11.1317 54.1487 11.1878 53.9212 11.2999C53.6937 11.4073 53.5033 11.5638 53.35 11.7694C53.2014 11.9749 53.09 12.2248 53.0157 12.5191C52.9414 12.8088 52.9043 13.1381 52.9043 13.5071C52.9043 13.8902 52.9437 14.2312 53.0227 14.5302C53.1063 14.8292 53.2247 15.0814 53.3779 15.287C53.5311 15.4879 53.7169 15.642 53.9351 15.7495C54.1534 15.8522 54.3995 15.9036 54.6735 15.9036C54.9474 15.9036 55.168 15.8709 55.3352 15.8055C55.507 15.7354 55.6509 15.6607 55.767 15.5813C55.8831 15.4972 55.983 15.4225 56.0665 15.3571C56.1548 15.287 56.2523 15.2519 56.3591 15.2519C56.4984 15.2519 56.6029 15.3057 56.6725 15.4131L57.1671 16.0438C56.9767 16.268 56.77 16.4572 56.5472 16.6113C56.3243 16.7608 56.0921 16.8823 55.8506 16.9757C55.6138 17.0645 55.3677 17.1275 55.1123 17.1649C54.8569 17.2023 54.6038 17.221 54.3531 17.221C53.9119 17.221 53.4963 17.1392 53.1063 16.9757C52.7162 16.8075 52.3749 16.5646 52.0823 16.247C51.7944 15.9293 51.5646 15.5416 51.3928 15.0838C51.2256 14.6213 51.142 14.0958 51.142 13.5071C51.142 12.9793 51.2163 12.4911 51.3649 12.0426C51.5181 11.5895 51.741 11.1994 52.0336 10.8724C52.3261 10.5408 52.6883 10.2815 53.1202 10.0946C53.552 9.90776 54.0489 9.81433 54.6108 9.81433C55.1448 9.81433 55.6115 9.90076 56.0108 10.0736C56.4148 10.2464 56.777 10.494 57.0974 10.8164L56.6447 11.447Z" fill="var(--color--text--standard)"></path><path d="M59.4456 6.70312V12.6663H59.766C59.8821 12.6663 59.9727 12.6499 60.0377 12.6172C60.1027 12.5845 60.1723 12.5238 60.2466 12.435L62.0228 10.2278C62.1018 10.1343 62.1853 10.0619 62.2736 10.0105C62.3618 9.95448 62.4779 9.92645 62.6218 9.92645H64.196L61.9741 12.5962C61.8951 12.6943 61.8139 12.7854 61.7303 12.8695C61.6467 12.9489 61.5561 13.019 61.4586 13.0797C61.5561 13.1498 61.642 13.2315 61.7163 13.325C61.7906 13.4184 61.8649 13.5188 61.9392 13.6263L64.3214 17.1159H62.7681C62.6334 17.1159 62.5197 17.0925 62.4268 17.0458C62.3339 16.9991 62.2504 16.9197 62.1761 16.8075L60.3581 14.0817C60.2884 13.9743 60.2188 13.9042 60.1491 13.8715C60.0795 13.8388 59.975 13.8225 59.8357 13.8225H59.4456V17.1159H57.7252V6.70312H59.4456Z" fill="var(--color--text--standard)"></path><path d="M65.9131 6.98341C65.9967 6.98341 66.0663 6.98809 66.1221 6.99743C66.1778 7.0021 66.2265 7.01611 66.2683 7.03947C66.3148 7.05816 66.3589 7.08852 66.4007 7.13057C66.4425 7.16794 66.4889 7.21932 66.54 7.28472L71.8267 14.0607C71.8081 13.8972 71.7942 13.7384 71.7849 13.5842C71.7803 13.4254 71.7779 13.2782 71.7779 13.1428V6.98341H73.4287V17.1159H72.4606C72.312 17.1159 72.1889 17.0925 72.0914 17.0458C71.9939 16.9991 71.8987 16.915 71.8058 16.7935L66.54 10.0456C66.5539 10.1951 66.5632 10.3445 66.5678 10.494C66.5771 10.6389 66.5818 10.772 66.5818 10.8934V17.1159H64.931V6.98341H65.9131Z" fill="var(--color--text--standard)"></path><path d="M77.8568 9.81433C78.3908 9.81433 78.8737 9.90076 79.3056 10.0736C79.7421 10.2464 80.1136 10.4917 80.42 10.8094C80.7265 11.127 80.9633 11.5148 81.1305 11.9726C81.2977 12.4304 81.3813 12.9419 81.3813 13.5071C81.3813 14.0771 81.2977 14.5909 81.1305 15.0487C80.9633 15.5065 80.7265 15.8966 80.42 16.2189C80.1136 16.5413 79.7421 16.7889 79.3056 16.9617C78.8737 17.1346 78.3908 17.221 77.8568 17.221C77.3228 17.221 76.8375 17.1346 76.401 16.9617C75.9645 16.7889 75.5907 16.5413 75.2796 16.2189C74.9731 15.8966 74.734 15.5065 74.5621 15.0487C74.395 14.5909 74.3114 14.0771 74.3114 13.5071C74.3114 12.9419 74.395 12.4304 74.5621 11.9726C74.734 11.5148 74.9731 11.127 75.2796 10.8094C75.5907 10.4917 75.9645 10.2464 76.401 10.0736C76.8375 9.90076 77.3228 9.81433 77.8568 9.81433ZM77.8568 15.8896C78.4511 15.8896 78.89 15.6887 79.1732 15.287C79.4611 14.8852 79.6051 14.2966 79.6051 13.5212C79.6051 12.7457 79.4611 12.1547 79.1732 11.7483C78.89 11.3419 78.4511 11.1387 77.8568 11.1387C77.2531 11.1387 76.8073 11.3442 76.5194 11.7553C76.2315 12.1618 76.0876 12.7504 76.0876 13.5212C76.0876 14.292 76.2315 14.8806 76.5194 15.287C76.8073 15.6887 77.2531 15.8896 77.8568 15.8896Z" fill="var(--color--text--standard)"></path><path d="M87.1954 17.1159C86.9725 17.1159 86.8262 17.0108 86.7566 16.8005L86.6173 16.1068C86.4687 16.275 86.3131 16.4268 86.1506 16.5623C85.9881 16.6978 85.8116 16.8146 85.6212 16.9127C85.4355 17.0108 85.2335 17.0855 85.0152 17.1369C84.8016 17.1929 84.5694 17.221 84.3187 17.221C83.9286 17.221 83.5711 17.1392 83.246 16.9757C82.921 16.8122 82.64 16.5763 82.4032 16.268C82.171 15.955 81.9899 15.5696 81.8599 15.1118C81.7345 14.654 81.6718 14.1308 81.6718 13.5422C81.6718 13.0096 81.7438 12.5145 81.8878 12.0566C82.0317 11.5988 82.2384 11.2018 82.5077 10.8654C82.777 10.5291 83.0997 10.2675 83.4759 10.0806C83.852 9.88908 84.2746 9.79331 84.7436 9.79331C85.1429 9.79331 85.4842 9.85871 85.7675 9.98952C86.0508 10.1156 86.3038 10.2862 86.5267 10.501V6.70312H88.2472V17.1159H87.1954ZM84.9038 15.8476C85.2613 15.8476 85.5655 15.7728 85.8162 15.6233C86.067 15.4738 86.3038 15.2613 86.5267 14.9857V11.7623C86.3317 11.5241 86.1181 11.3559 85.8859 11.2578C85.6584 11.1597 85.4123 11.1107 85.1476 11.1107C84.8875 11.1107 84.6507 11.1597 84.4371 11.2578C84.2281 11.3559 84.0494 11.5054 83.9008 11.7063C83.7568 11.9025 83.6454 12.1547 83.5664 12.4631C83.4875 12.7667 83.448 13.1264 83.448 13.5422C83.448 13.9626 83.4805 14.32 83.5455 14.6143C83.6152 14.9039 83.7127 15.1422 83.8381 15.329C83.9635 15.5112 84.1167 15.6443 84.2978 15.7284C84.4789 15.8079 84.6809 15.8476 84.9038 15.8476Z" fill="var(--color--text--standard)"></path><path d="M92.5074 9.81433C92.9578 9.81433 93.3711 9.88674 93.7472 10.0316C94.128 10.1764 94.4554 10.3889 94.7293 10.6692C95.0033 10.9448 95.2169 11.2859 95.3701 11.6923C95.5234 12.094 95.6 12.5542 95.6 13.0727C95.6 13.2035 95.593 13.3133 95.5791 13.402C95.5698 13.4861 95.5489 13.5539 95.5164 13.6052C95.4886 13.652 95.4491 13.687 95.398 13.7104C95.3469 13.729 95.2819 13.7384 95.203 13.7384H90.7869C90.838 14.4765 91.0354 15.0184 91.379 15.3641C91.7226 15.7098 92.1777 15.8826 92.7442 15.8826C93.0228 15.8826 93.262 15.8499 93.4616 15.7845C93.6659 15.7191 93.8424 15.6467 93.991 15.5673C94.1442 15.4879 94.2766 15.4154 94.388 15.35C94.5041 15.2846 94.6156 15.2519 94.7224 15.2519C94.792 15.2519 94.8524 15.266 94.9035 15.294C94.9545 15.322 94.9987 15.3617 95.0358 15.4131L95.5373 16.0438C95.3469 16.268 95.1333 16.4572 94.8965 16.6113C94.6597 16.7608 94.4112 16.8823 94.1512 16.9757C93.8958 17.0645 93.6334 17.1275 93.3641 17.1649C93.0994 17.2023 92.8417 17.221 92.591 17.221C92.0941 17.221 91.6321 17.1392 91.2048 16.9757C90.7776 16.8075 90.4061 16.5623 90.0904 16.24C89.7746 15.913 89.5262 15.5112 89.3451 15.0347C89.164 14.5536 89.0734 13.9977 89.0734 13.367C89.0734 12.8765 89.1524 12.4164 89.3103 11.9866C89.4681 11.5521 89.6934 11.1761 89.9859 10.8584C90.2831 10.5361 90.643 10.2815 91.0655 10.0946C91.4927 9.90776 91.9734 9.81433 92.5074 9.81433ZM92.5422 11.0546C92.0407 11.0546 91.6483 11.1971 91.365 11.4821C91.0818 11.767 90.9007 12.1711 90.8217 12.6943H94.0537C94.0537 12.4701 94.0235 12.2599 93.9631 12.0637C93.9028 11.8628 93.8099 11.6876 93.6845 11.5381C93.5591 11.3886 93.4013 11.2718 93.2109 11.1878C93.0205 11.099 92.7976 11.0546 92.5422 11.0546Z" fill="var(--color--text--standard)"></path><g clip-path="url(#clip1_2118_1944)"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 19.5C14.0373 19.5 15.885 18.6876 17.2366 17.3692C17.2737 17.333 17.2736 17.2736 17.237 17.237L12.0001 12.0001C12.0001 12.0001 12.0001 12 12.0001 12V12C12.0001 12 12.0001 12 12.0001 12.0001L20.4853 20.4852L23.7192 23.7191C23.7891 23.789 23.7171 23.9056 23.6232 23.8743L18.4624 22.154C18.4357 22.1451 18.4064 22.1487 18.3825 22.1637C16.5339 23.3271 14.3455 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 14.8307 23.0199 17.4324 21.3806 19.4844C21.3459 19.5278 21.2812 19.5311 21.2419 19.4918L14.906 13.1559C14.836 13.0859 14.908 12.9693 15.0019 13.0006L19.0281 14.3427C19.0772 14.3591 19.1304 14.3325 19.1461 14.2832C19.376 13.5633 19.5 12.7961 19.5 12C19.5 7.85786 16.1421 4.5 12 4.5C7.85786 4.5 4.5 7.85786 4.5 12C4.5 16.1421 7.85786 19.5 12 19.5Z" fill="#009FD1"></path></g></g><defs><clipPath id="clip0_2118_1944"><rect width="96" height="24" fill="white"></rect></clipPath><clipPath id="clip1_2118_1944"><rect width="24" height="24" fill="white"></rect></clipPath></defs></svg>
              QuickNode
            </div>
            <CardTitle className="text-2xl text-gray-100">Submit Your Feedback</CardTitle>
            <div></div><div></div><div></div>
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