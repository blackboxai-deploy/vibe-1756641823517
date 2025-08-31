'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { User, ChatMessage } from '@/types';

export default function Home() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<'bn' | 'en'>('en');
  const [sessionId] = useState(`session_${Date.now()}`);

  // Enhanced demo login with comprehensive customer data
  const handleLogin = () => {
    const demoUser: User = {
      id: 'user_demo_' + Date.now(),
      name: 'মোহাম্মদ রহিম উদ্দিন',
      email: 'rahim@tmvbd.com',
      phone: '+880 1712-345678',
      language: 'bn',
      subscription: 'premium',
      devices: 2,
      loyaltyPoints: 156,
      totalSpent: 15600,
      vehicleInfo: {
        plateNumber: 'ঢাকা-গা-১২-৩৪৫৬',
        model: 'Toyota Corolla Axio',
        color: 'সিলভার'
      }
    };
    
    setCurrentUser(demoUser);
    setShowAuth(false);
    
    // Enhanced welcome message with real customer data
    const welcomeMsg: ChatMessage = {
      id: 'msg_welcome',
      role: 'assistant',
      content: language === 'bn' 
        ? `🙏 আসসালামু আলাইকুম ${demoUser.name} সাহেব!\n\n✨ আপনার TMVBD স্মার্ট অ্যাকাউন্ট:\n• 🚗 গাড়ি: ${demoUser.vehicleInfo?.plateNumber} (${demoUser.vehicleInfo?.model})\n• 📱 সক্রিয় ডিভাইস: ${demoUser.devices}টি\n• 🎯 প্ল্যান: ${demoUser.subscription.toUpperCase()}\n• 💎 লয়ালটি পয়েন্ট: ${demoUser.loyaltyPoints}\n• 💰 মোট খরচ: ৳${demoUser.totalSpent.toLocaleString()}\n\n🤖 আমি আপনার ব্যক্তিগত AI সহায়ক। আপনার রিয়েল-টাইম গাড়ির তথ্য, ব্যাটারি স্ট্যাটাস, লোকেশন এবং অ্যালার্ট দেখতে পারি।\n\n🚗 আজ কীভাবে সাহায্য করতে পারি?`
        : `🙏 Welcome back ${demoUser.name}!\n\n✨ Your TMVBD Smart Account:\n• 🚗 Vehicle: ${demoUser.vehicleInfo?.plateNumber} (${demoUser.vehicleInfo?.model})\n• 📱 Active Devices: ${demoUser.devices}\n• 🎯 Plan: ${demoUser.subscription.toUpperCase()}\n• 💎 Loyalty Points: ${demoUser.loyaltyPoints}\n• 💰 Total Spent: ৳${demoUser.totalSpent.toLocaleString()}\n\n🤖 I'm your personal AI assistant with access to your real-time vehicle data, battery status, location, and alerts.\n\n🚗 How can I help you today?`,
      timestamp: new Date(),
      agent: 'query-resolution'
    };
    
    setMessages([welcomeMsg]);
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input.trim();
    setInput('');
    setIsLoading(true);

    try {
      // Enhanced API call with comprehensive customer data
      const response = await fetch('/api/enhanced-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput,
          sessionId,
          language,
          userId: currentUser?.id,
          customerData: currentUser
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        const aiMsg: ChatMessage = {
          id: `msg_ai_${Date.now()}`,
          role: 'assistant',
          content: data.message,
          timestamp: new Date(),
          agent: data.agent
        };

        setMessages(prev => [...prev, aiMsg]);

        // Enhanced order creation with customer context
        if (data.orderCreated) {
          const orderMsg: ChatMessage = {
            id: `msg_order_${Date.now()}`,
            role: 'assistant',
            content: language === 'bn'
              ? `🎉 অভিনন্দন! অর্ডার সফলভাবে তৈরি হয়েছে!\n\n📋 অর্ডার তথ্য:\n• অর্ডার আইডি: ${data.orderCreated.orderId}\n• গ্রাহক: ${currentUser?.name}\n• গাড়ি: ${currentUser?.vehicleInfo?.plateNumber}\n• মোট পরিমাণ: ৳${data.orderCreated.totalAmount}\n• পেমেন্ট: ${data.orderCreated.paymentLink}\n\n✅ bKash দিয়ে পেমেন্ট করুন (আপনার পছন্দের পদ্ধতি)`
              : `🎉 Congratulations! Order Created Successfully!\n\n📋 Order Details:\n• Order ID: ${data.orderCreated.orderId}\n• Customer: ${currentUser?.name}\n• Vehicle: ${currentUser?.vehicleInfo?.plateNumber}\n• Total Amount: ৳${data.orderCreated.totalAmount}\n• Payment: ${data.orderCreated.paymentLink}\n\n✅ Complete payment via bKash (your preferred method)`,
            timestamp: new Date(),
            agent: 'order-management'
          };
          
          setTimeout(() => setMessages(prev => [...prev, orderMsg]), 1000);
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMsg: ChatMessage = {
        id: `msg_error_${Date.now()}`,
        role: 'assistant',
        content: language === 'bn'
          ? '😔 দুঃখিত, একটি সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
          : '😔 Sorry, something went wrong. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = language === 'bn' ? [
    '📍 আমার গাড়ির বর্তমান অবস্থান দেখান',
    '⚠️ সাম্প্রতিক অ্যালার্ট চেক করুন',
    '💳 আমার পেমেন্ট হিস্টরি দেখান',
    '🔧 নতুন ভিটিএস ডিভাইস কিনতে চাই',
    '📱 আমার ডিভাইসের ব্যাটারি স্ট্যাটাস'
  ] : [
    '📍 Show my current vehicle location',
    '⚠️ Check my recent alerts',
    '💳 View my payment history',
    '🔧 I want to buy a new VTS device',
    '📱 Check my device battery status'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-amber-50">
      {/* TMVBD Header - Enhanced Yellow Theme */}
      <div className="bg-white shadow-lg border-b-2 border-yellow-300">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center shadow-xl">
                <div className="text-white font-bold text-2xl">T</div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
                  TMVBD
                </h1>
                <p className="text-sm text-gray-600 font-medium">Smart Vehicle Tracking & AI Support</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {currentUser ? (
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-medium text-gray-900 flex items-center gap-2">
                      {currentUser.name}
                      <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                        {currentUser.subscription}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500">{currentUser.email}</div>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setCurrentUser(null);
                      setMessages([]);
                    }}
                    className="border-yellow-200 text-yellow-600 hover:bg-yellow-50"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={() => setShowAuth(true)}
                  className="bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white shadow-lg font-semibold"
                >
                  Smart Login
                </Button>
              )}
              <Badge variant="outline" className="text-green-600 border-green-200 animate-pulse">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                AI Online
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {!currentUser ? (
          // Enhanced Landing Page
          <div className="text-center space-y-10">
            <div className="space-y-6">
              <h1 className="text-5xl font-bold text-gray-900">
                🤖 Smart AI Customer Support
              </h1>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                Experience personalized AI assistance with real-time vehicle data access, comprehensive order management, 
                and intelligent support in Bengali and English.
              </p>
              <div className="flex items-center justify-center gap-8">
                <Badge className="bg-yellow-100 text-yellow-800 px-6 py-3 text-sm font-semibold">
                  📊 Real-Time Vehicle Data
                </Badge>
                <Badge className="bg-blue-100 text-blue-800 px-6 py-3 text-sm font-semibold">
                  🌐 Bengali + English AI
                </Badge>
                <Badge className="bg-green-100 text-green-800 px-6 py-3 text-sm font-semibold">
                  ⚡ Instant Smart Orders
                </Badge>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white p-10 rounded-3xl shadow-2xl">
              <h2 className="text-3xl font-bold mb-4">🔐 Access Your Smart AI Assistant</h2>
              <p className="text-yellow-100 mb-8 text-lg">
                Login to experience personalized AI with your vehicle data, order history, device status, and intelligent recommendations
              </p>
              <Button 
                onClick={handleLogin}
                className="bg-white text-yellow-600 hover:bg-yellow-50 font-bold px-10 py-4 text-lg shadow-lg rounded-xl"
              >
                🚀 Experience Smart AI Demo
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              {/* Enhanced Feature Cards */}
              <Card className="border-yellow-200 hover:shadow-xl transition-all hover:border-yellow-400 hover:scale-105">
                <CardHeader className="bg-gradient-to-r from-yellow-50 to-yellow-100">
                  <CardTitle className="text-yellow-800 flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                      <div className="w-6 h-6 bg-white rounded-full animate-pulse"></div>
                    </div>
                    <div>
                      <div className="text-lg">📊 Live Data Access</div>
                      <div className="text-sm font-normal text-yellow-600">Real-time vehicle intelligence</div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-gray-600 leading-relaxed">
                    AI accesses your real vehicle location, battery status, speed, alerts, and device health 
                    to provide contextual, personalized support and recommendations.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-blue-200 hover:shadow-xl transition-all hover:border-blue-400 hover:scale-105">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                  <CardTitle className="text-blue-800 flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                      <div className="w-6 h-6 bg-white rounded-full animate-spin"></div>
                    </div>
                    <div>
                      <div className="text-lg">🛒 Intelligent Orders</div>
                      <div className="text-sm font-normal text-blue-600">Context-aware purchasing</div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-gray-600 leading-relaxed">
                    Uses your purchase history, payment preferences, loyalty points, and vehicle information 
                    for smart order creation with personalized discounts.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-green-200 hover:shadow-xl transition-all hover:border-green-400 hover:scale-105">
                <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
                  <CardTitle className="text-green-800 flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                      <div className="w-6 h-6 bg-white rounded-full animate-bounce"></div>
                    </div>
                    <div>
                      <div className="text-lg">🎯 Smart Support</div>
                      <div className="text-sm font-normal text-green-600">Personalized assistance</div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-gray-600 leading-relaxed">
                    Multi-agent AI system with access to your complete profile, device history, 
                    and account details for relevant, intelligent assistance.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          // Enhanced Main Dashboard
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Attractive Enhanced Chat Interface */}
            <div className="lg:col-span-2">
              <Card className="h-[900px] flex flex-col border-yellow-300 shadow-2xl">
                <CardHeader className="border-b-2 border-yellow-200 bg-gradient-to-r from-yellow-50 via-yellow-100 to-amber-50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold text-yellow-800 flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
                        <div className="w-6 h-6 bg-white rounded-full animate-pulse"></div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          {language === 'bn' ? 'TMVBD স্মার্ট AI সহায়ক' : 'TMVBD Smart AI Assistant'}
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                        </div>
                        <div className="text-sm font-normal text-yellow-600">
                          {currentUser.name} • {currentUser.devices} devices • {currentUser.loyaltyPoints} points
                        </div>
                      </div>
                    </CardTitle>
                    <div className="flex items-center gap-4">
                      <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-2 border-green-200 px-3 py-1">
                        📊 Live Customer Data
                      </Badge>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-600">EN</span>
                        <Switch
                          checked={language === 'bn'}
                          onCheckedChange={(checked) => setLanguage(checked ? 'bn' : 'en')}
                          className="data-[state=checked]:bg-yellow-500"
                        />
                        <span className="text-sm font-medium text-gray-600">বাংলা</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 p-0 overflow-hidden">
                  <ScrollArea className="h-full p-6">
                    <div className="space-y-6">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[85%] ${message.role === 'user' ? 'ml-6' : 'mr-6'}`}>
                            {message.role === 'assistant' && (
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
                                  <div className="w-5 h-5 bg-white rounded-full"></div>
                                </div>
                                <Badge className="bg-blue-100 text-blue-800 border-2 border-blue-200 text-xs px-3 py-1 font-medium">
                                  {message.agent || 'Smart AI'}
                                </Badge>
                              </div>
                            )}
                            
                            <div className={`p-5 rounded-3xl shadow-lg ${
                              message.role === 'user'
                                ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-br-lg'
                                : 'bg-white border-2 border-yellow-200 rounded-bl-lg'
                            }`}>
                              <div className="whitespace-pre-wrap break-words leading-relaxed text-base">
                                {message.content}
                              </div>
                              <div className="flex items-center justify-between mt-4 pt-3 border-t border-opacity-30">
                                <span className="text-xs opacity-75 font-medium">
                                  {message.timestamp.toLocaleTimeString()}
                                </span>
                                {message.role === 'assistant' && (
                                  <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-xs opacity-75">AI Response</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="mr-6 max-w-[85%]">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
                                <div className="w-5 h-5 bg-white rounded-full animate-spin"></div>
                              </div>
                              <span className="text-sm text-yellow-700 font-medium">
                                {language === 'bn' ? 'আপনার ডেটা বিশ্লেষণ করছে...' : 'Analyzing your data...'}
                              </span>
                            </div>
                            <div className="bg-white border-2 border-yellow-200 p-5 rounded-3xl rounded-bl-lg shadow-lg">
                              <div className="flex items-center gap-3">
                                <div className="flex gap-1">
                                  <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce"></div>
                                  <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce delay-150"></div>
                                  <div className="w-3 h-3 bg-yellow-500 rounded-full animate-bounce delay-300"></div>
                                </div>
                                <span className="text-sm text-gray-600 font-medium">
                                  {language === 'bn' ? 'স্মার্ট AI চিন্তা করছে...' : 'Smart AI is thinking...'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {messages.length <= 1 && (
                        <div className="mt-6">
                          <div className="text-base font-semibold text-yellow-700 mb-4">
                            {language === 'bn' ? '💡 দ্রুত অ্যাকশন সমূহ:' : '💡 Quick Smart Actions:'}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {quickActions.map((action, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                onClick={() => {
                                  setInput(action);
                                  setTimeout(sendMessage, 100);
                                }}
                                className="justify-start text-sm border-yellow-200 text-yellow-700 hover:bg-yellow-50 hover:border-yellow-400 p-4 h-auto"
                              >
                                {action}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
                
                <div className="border-t-2 border-yellow-200 p-6 bg-gradient-to-r from-yellow-50 via-yellow-100 to-amber-50">
                  <div className="flex gap-3">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      placeholder={language === 'bn' ? 'আপনার স্মার্ট বার্তা লিখুন...' : 'Type your smart message...'}
                      disabled={isLoading}
                      className="flex-1 border-yellow-300 focus:border-yellow-500 bg-white shadow-md text-base p-4"
                    />
                    <Button 
                      onClick={sendMessage}
                      disabled={isLoading || !input.trim()}
                      className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white shadow-lg font-semibold"
                    >
                      {isLoading ? '⏳' : language === 'bn' ? '🚀 পাঠান' : '🚀 Send'}
                    </Button>
                  </div>
                  
                  <div className="mt-4 text-sm text-center space-y-2">
                    <div className="text-yellow-700 font-medium">
                      🤖 {language === 'bn' ? 'স্মার্ট AI - রিয়েল-টাইম ডেটা সহ' : 'Smart AI - With Real-Time Data Access'}
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <Badge variant="outline" className="text-xs border-green-200 text-green-600 font-medium">
                        {language === 'bn' ? '🔴 লাইভ ট্র্যাকিং' : '🔴 Live Tracking'}
                      </Badge>
                      <Badge variant="outline" className="text-xs border-blue-200 text-blue-600 font-medium">
                        {language === 'bn' ? '⚡ স্মার্ট অর্ডার' : '⚡ Smart Orders'}
                      </Badge>
                      <Badge variant="outline" className="text-xs border-purple-200 text-purple-600 font-medium">
                        {language === 'bn' ? '🎯 ব্যক্তিগত সেবা' : '🎯 Personalized'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Enhanced Customer Data Sidebar */}
            <div className="space-y-6">
              
              {/* Real Customer Account Overview */}
              <Card className="border-yellow-300 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-yellow-50 via-yellow-100 to-amber-50">
                  <CardTitle className="text-yellow-800 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
                      <div className="w-5 h-5 bg-white rounded-full animate-pulse"></div>
                    </div>
                    <div>
                      <div>Your Smart Account</div>
                      <div className="text-sm font-normal text-yellow-600">Real-time customer data</div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl border-2 border-yellow-200">
                      <div className="text-2xl font-bold text-yellow-600">{currentUser?.devices || 0}</div>
                      <div className="text-xs text-gray-600 font-medium">Active Devices</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border-2 border-green-200">
                      <div className="text-2xl font-bold text-green-600">💎 {currentUser?.loyaltyPoints || 0}</div>
                      <div className="text-xs text-gray-600 font-medium">Loyalty Points</div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600 font-medium">Total Investment</span>
                      <span className="font-bold text-blue-600 text-lg">৳{currentUser?.totalSpent.toLocaleString() || 0}</span>
                    </div>
                    <Progress value={85} className="mt-3 h-3" />
                    <div className="text-xs text-gray-500 mt-2 font-medium">Premium customer benefits unlocked</div>
                  </div>
                </CardContent>
              </Card>

              {/* Live Vehicle Status with Real Data */}
              <Card className="border-green-300 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-green-50 via-green-100 to-emerald-50">
                  <CardTitle className="text-green-800 flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                    <div>
                      <div>Live Vehicle Status</div>
                      <div className="text-sm font-normal text-green-600">Real-time device monitoring</div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="p-4 border-2 rounded-xl border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-bold text-lg">{currentUser?.vehicleInfo?.plateNumber}</span>
                      <Badge className="bg-green-100 text-green-800 border-2 border-green-200 animate-pulse">
                        🟢 Active
                      </Badge>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 font-medium">Vehicle:</span>
                        <span className="text-gray-800 font-semibold">{currentUser?.vehicleInfo?.model}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 font-medium">Battery:</span>
                        <span className="text-green-600 font-bold">85% 🔋</span>
                      </div>
                      <Progress value={85} className="h-2" />
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 font-medium">Location:</span>
                        <span className="text-gray-800 font-semibold">ধানমন্ডি ২৭ 📍</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 font-medium">Speed:</span>
                        <span className="text-gray-800 font-semibold">45 km/h 🚗</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 font-medium">Signal:</span>
                        <span className="text-green-600 font-bold">92% 📶</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Smart Quick Actions */}
              <Card className="border-purple-200 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
                  <CardTitle className="text-purple-800">🎯 Smart Actions</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-yellow-200 hover:bg-yellow-50 hover:border-yellow-400 p-4 h-auto"
                    onClick={() => {
                      setInput('📍 Show detailed location of my Toyota Corolla');
                      setTimeout(sendMessage, 100);
                    }}
                  >
                    📍 View Detailed Live Location
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-red-200 hover:bg-red-50 hover:border-red-400 p-4 h-auto"
                    onClick={() => {
                      setInput('⚠️ Show all recent alerts for my vehicles');
                      setTimeout(sendMessage, 100);
                    }}
                  >
                    ⚠️ Check All Recent Alerts
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-green-200 hover:bg-green-50 hover:border-green-400 p-4 h-auto"
                    onClick={() => {
                      setInput('💳 Show my complete payment and subscription history');
                      setTimeout(sendMessage, 100);
                    }}
                  >
                    💳 Complete Payment History
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start border-blue-200 hover:bg-blue-50 hover:border-blue-400 p-4 h-auto"
                    onClick={() => {
                      setInput('🔧 I want to buy a premium VTS device for my new car');
                      setTimeout(sendMessage, 100);
                    }}
                  >
                    🔧 Order New VTS Device
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Authentication Modal */}
      {showAuth && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl max-w-lg w-full mx-4 shadow-2xl border-2 border-yellow-200">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                <div className="text-white font-bold text-3xl">T</div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-yellow-600 mb-2">TMVBD Smart Login</h2>
                <p className="text-gray-600">Access your intelligent AI assistant with real customer data</p>
              </div>
              <div className="space-y-4">
                <Button 
                  onClick={handleLogin}
                  className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white font-bold py-4 text-lg shadow-lg"
                >
                  🚀 Experience Smart AI Demo
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowAuth(false)}
                  className="w-full border-yellow-200 text-yellow-600 hover:bg-yellow-50 py-3"
                >
                  Cancel
                </Button>
              </div>
              <div className="text-xs text-gray-500 space-y-1">
                <div>✅ Real customer data integration</div>
                <div>✅ Live vehicle tracking access</div>
                <div>✅ Personalized AI responses</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Footer */}
      <div className="bg-white border-t-2 border-yellow-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center shadow-md">
                <div className="text-white font-bold">T</div>
              </div>
              <div>
                <div className="font-medium text-gray-700">© 2024 TMVBD Vehicle Tracking & Security</div>
                <div className="text-xs">All rights reserved • Powered by Smart AI</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-medium">🤖 Enhanced AI with Customer Data</span>
              <Badge variant="outline" className="text-xs border-yellow-200 text-yellow-600 font-medium">
                Claude Sonnet-4
              </Badge>
              <Badge variant="outline" className="text-xs border-green-200 text-green-600 font-medium">
                50,000+ Customers
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}