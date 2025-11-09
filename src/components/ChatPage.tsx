import { ArrowLeft, Send } from 'lucide-react';
import { useState } from 'react';

interface ChatPageProps {
  onBack: () => void;
}

interface Message {
  id: number;
  text: string;
  isUser: boolean;
}

export function ChatPage({ onBack }: ChatPageProps) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'привет! какой у вас вопрос?', isUser: false }
  ]);

  const handleSend = () => {
    if (!message.trim()) return;

    // Add user message
    const newUserMessage: Message = {
      id: messages.length + 1,
      text: message,
      isUser: true
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setMessage('');

    // Add bot response after a short delay
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: 'я уверен, что с этим лучше разберется оператор, а не ии. позвоните специалисту по номеру +7 912 703 79 79. спасибо!',
        isUser: false
      };
      setMessages(prev => [...prev, botResponse]);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="p-6 flex items-center gap-4">
        <button 
          onClick={onBack}
          className="bg-white text-black hover:text-red-600 transition-colors duration-200"
        >
          <ArrowLeft size={28} />
        </button>
        
        <h1 className="text-2xl">служба заботы</h1>
      </div>

      {/* Chat Content */}
      <div className="flex-1 px-6 py-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`p-4 max-w-md ${
                    msg.isUser 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-100 text-black'
                  }`}
                  style={{ borderRadius: msg.isUser ? '20px 20px 0 20px' : '20px 20px 20px 0' }}
                >
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="наберите сообщение"
              className="w-full bg-gray-100 px-6 py-4 pr-16 outline-none focus:bg-gray-200 transition-colors"
              style={{ borderRadius: '30px' }}
            />
            <button 
              onClick={handleSend}
              className="absolute right-4 top-1/2 text-red-600 hover:text-red-700 transition-colors"
              style={{ transform: 'translateY(-50%)' }}
            >
              <Send size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}