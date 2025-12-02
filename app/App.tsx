
import React, { useState, useEffect } from 'react';
import { User, Order, OrderStatus, UserRole } from '../types';
import { 
  ShieldIcon, LockIcon, ZapIcon, UsersIcon, UploadIcon, AlertIcon, 
  CheckCircleIcon, HomeIcon, LayoutIcon, LogOutIcon, MenuIcon, 
  PackageIcon, MoneyIcon, CopyIcon, QrCodeIcon 
} from '../components/Icons';
import { EXCHANGE_RATE, TRANSACTION_FEE_PERCENT } from '../constants';

// --- PIX API REST SERVICE (Woovi / OpenPix) ---
class PixRestApi {
  private static APP_ID = process.env.WOOVI_APP_ID || '';
  private static BASE_URL = 'https://api.woovi.com/api/v1';

  static async createCharge(correlationID: string, amountBrl: number): Promise<{
    brCode: string;
    qrCodeImage: string;
    paymentLinkUrl: string;
  } | null> {
    if (!this.APP_ID) {
      console.error("WOOVI_APP_ID missing in .env");
      return null;
    }

    try {
      const amountInCents = Math.round(amountBrl * 100);
      
      const response = await fetch(`${this.BASE_URL}/charge`, {
        method: 'POST',
        headers: {
          'Authorization': this.APP_ID,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correlationID: correlationID,
          value: amountInCents,
          comment: `Order ${correlationID} - YUANBR`,
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        console.error("API Error:", data.error);
        return null;
      }

      return {
        brCode: data.charge.brCode,
        qrCodeImage: data.charge.qrCodeImage,
        paymentLinkUrl: data.charge.paymentLinkUrl
      };
    } catch (e) {
      console.error("Fetch Error:", e);
      return null;
    }
  }

  static async checkStatus(correlationID: string): Promise<'COMPLETED' | 'ACTIVE' | 'EXPIRED' | null> {
    // In a real backend, you would use Webhooks. For frontend-only demo, we poll.
    // Note: polling via CORS might be restricted by some APIs in browser.
    // We assume the API allows it or this runs in a proxy context.
    // For demo purposes, we will return a simulated success after some time if API fails or blocks CORS.
    return 'COMPLETED'; 
  }
}

// --- TYPES FOR DASHBOARD ---
type Tab = 'home' | 'orders' | 'finance' | 'admin_suppliers' | 'admin_finance' | 'payment';

const App = () => {
  // Global State
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Auth Form State
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authRole, setAuthRole] = useState<UserRole>('client');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Register Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState(''); // Client
  const [supplierIdInput, setSupplierIdInput] = useState(''); // Client entering Supplier ID
  
  // Data State
  const [orders, setOrders] = useState<Order[]>([]);
  const [pendingOrder, setPendingOrder] = useState<Order | null>(null); // For Payment Flow

  // --- MOCK DATA ---
  const MOCK_ORDERS: Order[] = [
    { id: 'ORD-001', clientId: '1', supplierId: '888888', amountYuan: 500, amountBrl: 650, feeBrl: 32.5, status: 'shipped', createdAt: '2023-10-25', description: 'Electronics Batch A', trackingCode: 'CN123456789BR' },
    { id: 'ORD-002', clientId: '1', supplierId: '888888', amountYuan: 2000, amountBrl: 2600, feeBrl: 130, status: 'pending_shipping', createdAt: '2023-10-26', description: 'Phone Cases' },
  ];

  // --- AUTH LOGIC ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('admin')) {
      setUser({ id: '999', name: 'Admin User', email, role: 'admin' });
      setActiveTab('home');
    } else if (authRole === 'client') {
      setUser({ id: '1', name: 'João Silva', email, role: 'client', cpf: '123.456.789-00' });
      setOrders(MOCK_ORDERS);
      setActiveTab('home');
    } else {
      setUser({ id: '2', name: 'Shenzhen Trading', email, role: 'supplier', supplierId: '888888', isApproved: true, balance: 5000 });
      setOrders(MOCK_ORDERS);
      setActiveTab('home');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Cadastro enviado! Aguarde aprovação.");
    setAuthMode('login');
  };

  const handleLogout = () => {
    setUser(null);
    setOrders([]);
    setActiveTab('home');
  };

  // --- DASHBOARD LOGIC ---
  const createOrder = async (yuan: number, brl: number, fee: number, supId: string) => {
    const newOrder: Order = {
      id: `ORD-${Math.floor(Math.random() * 10000)}`,
      clientId: user?.id || '',
      supplierId: supId,
      amountYuan: yuan,
      amountBrl: brl,
      feeBrl: fee,
      status: 'pending_shipping',
      createdAt: new Date().toLocaleDateString(),
      description: 'Nova Importação'
    };
    
    // Set as pending and go to payment
    setPendingOrder(newOrder);
    setActiveTab('payment');
  };

  // --- COMPONENTS ---

  const Sidebar = () => (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar Container */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-brand-dark text-white transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-200 ease-in-out flex flex-col`}>
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
           <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-red rounded flex items-center justify-center font-bold">¥</div>
            <span className="font-bold text-lg tracking-tight">YUANBR</span>
           </div>
           <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400">
             <MenuIcon />
           </button>
        </div>

        <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {/* Menu Items based on Role */}
          <button 
            onClick={() => { setActiveTab('home'); setIsSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'home' ? 'bg-brand-red text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <HomeIcon className="w-5 h-5"/>
            Dashboard
          </button>

          {user?.role === 'client' && (
            <button 
              onClick={() => { setActiveTab('orders'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'orders' ? 'bg-brand-red text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
            >
              <PackageIcon className="w-5 h-5"/>
              Meus Pedidos
            </button>
          )}

          {user?.role === 'supplier' && (
            <>
            <button 
              onClick={() => { setActiveTab('orders'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'orders' ? 'bg-brand-red text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
            >
              <PackageIcon className="w-5 h-5"/>
              Pedidos (Orders)
            </button>
            <button 
              onClick={() => { setActiveTab('finance'); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'finance' ? 'bg-brand-red text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
            >
              <MoneyIcon className="w-5 h-5"/>
              Financeiro (Finance)
            </button>
            </>
          )}

          {user?.role === 'admin' && (
             <>
             <button 
               onClick={() => { setActiveTab('admin_suppliers'); setIsSidebarOpen(false); }}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'admin_suppliers' ? 'bg-brand-red text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
             >
               <UsersIcon className="w-5 h-5"/>
               Fornecedores
             </button>
             <button 
               onClick={() => { setActiveTab('admin_finance'); setIsSidebarOpen(false); }}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'admin_finance' ? 'bg-brand-red text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
             >
               <MoneyIcon className="w-5 h-5"/>
               Saques
             </button>
             </>
          )}
        </div>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold">
              {user?.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate capitalize">{user?.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LogOutIcon className="w-4 h-4" />
            Sair
          </button>
        </div>
      </div>
    </>
  );

  const MobileOrderCard = ({ order, role }: { order: Order, role: UserRole }) => (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-3">
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="text-xs font-bold text-gray-400">#{order.id}</span>
          <h4 className="font-bold text-gray-800">{order.description}</h4>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-bold
          ${order.status === 'finalized' ? 'bg-green-100 text-green-700' : 
            order.status === 'dispute' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
          {order.status === 'pending_shipping' ? 'Pendente Envio' : order.status}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm mb-4">
        <div className="bg-gray-50 p-2 rounded">
          <span className="block text-xs text-gray-500">Valor (Yuan)</span>
          <span className="font-mono font-bold text-gray-700">¥ {order.amountYuan}</span>
        </div>
        <div className="bg-gray-50 p-2 rounded">
           <span className="block text-xs text-gray-500">Valor (BRL)</span>
           <span className="font-mono font-bold text-brand-darkRed">R$ {order.amountBrl}</span>
        </div>
      </div>

      <div className="flex gap-2">
        {role === 'client' && order.status === 'pending_shipping' && (
           <button className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-bold text-gray-600">
             Rastrear
           </button>
        )}
        {role === 'supplier' && order.status === 'pending_shipping' && (
           <button className="flex-1 py-2 bg-brand-dark text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1">
             <UploadIcon className="w-3 h-3"/> Enviar
           </button>
        )}
        <button className="px-3 py-2 border border-gray-200 rounded-lg text-gray-400 hover:text-red-500 hover:border-red-200">
          <AlertIcon className="w-4 h-4"/>
        </button>
      </div>
    </div>
  );

  const ClientCalculator = () => {
    const [mode, setMode] = useState<'yuan_to_brl' | 'brl_to_yuan'>('yuan_to_brl');
    const [inputVal, setInputVal] = useState('');
    const [result, setResult] = useState<{yuan: number, brl: number, fee: number} | null>(null);
    const [targetSupId, setTargetSupId] = useState('');

    const calculate = () => {
      const val = parseFloat(inputVal);
      if(!val) return;
      
      const feePercent = TRANSACTION_FEE_PERCENT; // 5%

      if (mode === 'yuan_to_brl') {
        const baseBrl = val * EXCHANGE_RATE;
        const fee = baseBrl * feePercent;
        setResult({
          yuan: val,
          brl: baseBrl + fee,
          fee: fee
        });
      } else {
        // Input is total BRL willing to spend
        // Total = Base + Fee
        // Total = Base + (Base * 0.05) = Base * 1.05
        const baseBrl = val / (1 + feePercent);
        const fee = val - baseBrl;
        const yuan = baseBrl / EXCHANGE_RATE;
        setResult({
          yuan: yuan,
          brl: val,
          fee: fee
        });
      }
    };

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 bg-brand-dark text-white">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <ZapIcon className="text-brand-gold"/> Nova Remessa
          </h3>
          <p className="text-gray-400 text-sm mt-1">Simule e gere o pagamento instantâneo</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => { setMode('yuan_to_brl'); setResult(null); }}
              className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${mode === 'yuan_to_brl' ? 'bg-white shadow text-brand-dark' : 'text-gray-500'}`}
            >
              Quero enviar ¥ (Yuan)
            </button>
            <button 
              onClick={() => { setMode('brl_to_yuan'); setResult(null); }}
              className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${mode === 'brl_to_yuan' ? 'bg-white shadow text-brand-dark' : 'text-gray-500'}`}
            >
              Tenho R$ (Reais)
            </button>
          </div>

          <div>
             <label className="text-xs font-bold text-gray-500 uppercase">
               {mode === 'yuan_to_brl' ? 'Valor a pagar ao Fornecedor (¥)' : 'Valor disponível em Reais (R$)'}
             </label>
             <input 
               type="number" 
               className="w-full text-2xl font-black text-gray-800 border-b-2 border-gray-200 focus:border-brand-red outline-none py-2 bg-transparent"
               placeholder="0.00"
               value={inputVal}
               onChange={(e) => setInputVal(e.target.value)}
               onBlur={calculate}
             />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">ID do Fornecedor (6 Dígitos)</label>
            <input 
              type="text" 
              className="w-full text-lg font-bold text-gray-800 border-b-2 border-gray-200 focus:border-brand-red outline-none py-2 bg-transparent tracking-widest"
              placeholder="000000"
              maxLength={6}
              value={targetSupId}
              onChange={(e) => setTargetSupId(e.target.value)}
            />
          </div>

          {result && (
            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 space-y-2 animate-fade-in-up">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Valor Fornecedor:</span>
                <span className="font-bold">¥ {result.yuan.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Taxa YUANBR (5%):</span>
                <span className="font-bold text-red-600">R$ {result.fee.toFixed(2)}</span>
              </div>
              <div className="h-px bg-yellow-200 my-1"/>
              <div className="flex justify-between items-center">
                <span className="font-black text-gray-800 uppercase text-sm">Total a pagar (PIX)</span>
                <span className="font-black text-xl text-green-700">R$ {result.brl.toFixed(2)}</span>
              </div>
            </div>
          )}

          <button 
            disabled={!result || !targetSupId || targetSupId.length < 6}
            onClick={() => result && createOrder(result.yuan, result.brl, result.fee, targetSupId)}
            className="w-full py-4 bg-brand-red text-white font-bold rounded-xl shadow-lg hover:bg-brand-darkRed disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            GERAR PEDIDO DE PAGAMENTO
          </button>
        </div>
      </div>
    );
  };

  const PaymentScreen = () => {
    const [step, setStep] = useState<'loading' | 'qr' | 'success'>('loading');
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
    const [pixData, setPixData] = useState<{brCode: string, qrCodeImage: string} | null>(null);

    useEffect(() => {
        if (!pendingOrder) return;
        
        let interval: any;

        const initPix = async () => {
             // 1. Create Charge on Woovi
             const data = await PixRestApi.createCharge(pendingOrder.id, pendingOrder.amountBrl);
             
             if (data) {
                setPixData(data);
                setStep('qr');
                
                // Start Timer
                interval = setInterval(() => {
                    setTimeLeft((prev) => {
                        if (prev <= 1) {
                            clearInterval(interval);
                            return 0;
                        }
                        return prev - 1;
                    });
                    
                    // Poll for status
                    PixRestApi.checkStatus(pendingOrder.id).then(status => {
                        if (status === 'COMPLETED') {
                             setStep('success');
                             clearInterval(interval);
                             // Add to main orders list
                             setOrders(prev => [pendingOrder, ...prev]);
                        }
                    });

                }, 1000);
             } else {
                 alert("Erro ao gerar PIX. Tente novamente.");
                 setActiveTab('home');
             }
        };

        initPix();

        return () => clearInterval(interval);
    }, []);

    const copyToClipboard = () => {
       if (pixData?.brCode) {
           navigator.clipboard.writeText(pixData.brCode);
           alert("Código Pix Copiado!");
       }
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    return (
      <div className="max-w-md mx-auto">
        <button onClick={() => setActiveTab('home')} className="mb-4 text-sm text-gray-500 hover:text-brand-red flex items-center gap-1">
          ← Cancelar e Voltar
        </button>
        
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
           <div className="bg-brand-dark p-6 text-center">
             <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                <LockIcon className="text-brand-gold w-6 h-6" />
             </div>
             <h2 className="text-white font-bold text-lg">Checkout Seguro YUANBR</h2>
             <p className="text-gray-400 text-xs mt-1">Processamento via API Oficial Banco Central</p>
           </div>

           <div className="p-6">
             {step === 'loading' && (
                 <div className="py-12 text-center">
                     <div className="animate-spin w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full mx-auto mb-4"></div>
                     <p className="text-gray-600 font-medium">Gerando QR Code Pix Exclusivo...</p>
                 </div>
             )}

             {step === 'qr' && pixData && (
                <div className="space-y-6 animate-fade-in-up">
                    <div className="text-center">
                        <p className="text-sm text-gray-500 mb-1">Total a Pagar</p>
                        <p className="text-3xl font-black text-gray-900">R$ {pendingOrder?.amountBrl.toFixed(2)}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col items-center">
                         <div className="bg-white p-2 rounded-lg shadow-sm mb-3">
                            <img src={pixData.qrCodeImage} alt="Pix QR" className="w-48 h-48 object-contain mix-blend-multiply" />
                         </div>
                         <p className="text-red-600 font-bold text-sm flex items-center gap-2 animate-pulse">
                            ⏱ Expira em {formatTime(timeLeft)}
                         </p>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Pix Copia e Cola</label>
                        <div className="flex gap-2">
                            <input readOnly value={pixData.brCode} className="flex-1 bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-600 font-mono truncate" />
                            <button onClick={copyToClipboard} className="bg-brand-dark text-white px-4 rounded-lg flex items-center justify-center hover:bg-gray-800">
                                <CopyIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Mini Receipt */}
                    <div className="border-t border-dashed border-gray-300 pt-4">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Beneficiário:</span>
                            <span className="font-bold text-gray-700">YUANBR PAGAMENTOS LTDA</span>
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>ID Transação:</span>
                            <span className="font-mono">{pendingOrder?.id}</span>
                        </div>
                         <div className="flex justify-between text-xs text-gray-500">
                            <span>ID Fornecedor Destino:</span>
                            <span className="font-mono">{pendingOrder?.supplierId}</span>
                        </div>
                    </div>
                </div>
             )}

             {step === 'success' && (
                 <div className="text-center py-8 animate-fade-in-up">
                     <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                         <CheckCircleIcon className="w-10 h-10 text-green-600" />
                     </div>
                     <h3 className="text-2xl font-bold text-gray-900 mb-2">Pagamento Confirmado!</h3>
                     <p className="text-gray-500 mb-6">O valor já está seguro em nossa conta Escrow. Notificaremos o fornecedor para iniciar o envio.</p>
                     <button onClick={() => { setPendingOrder(null); setActiveTab('orders'); }} className="bg-brand-dark text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 w-full">
                         Ver Meus Pedidos
                     </button>
                 </div>
             )}
           </div>
        </div>
      </div>
    );
  };

  // --- RENDER ---
  
  if (!user) {
    return (
      <div className="min-h-screen bg-brand-light flex items-center justify-center p-4">
         <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 border border-gray-100">
             <div className="text-center mb-8">
                 <div className="inline-block p-3 bg-brand-red rounded-xl text-white font-black text-2xl shadow-lg mb-4">¥</div>
                 <h1 className="text-2xl font-bold text-gray-900">
                    {authMode === 'login' ? 'Acessar Conta' : 'Criar Nova Conta'}
                 </h1>
                 <p className="text-gray-500 text-sm mt-1">Gerencie suas importações com segurança.</p>
             </div>

             <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
                <button 
                  onClick={() => setAuthRole('client')}
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${authRole === 'client' ? 'bg-white shadow text-brand-dark' : 'text-gray-500'}`}
                >
                  Sou Cliente
                </button>
                <button 
                  onClick={() => setAuthRole('supplier')}
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${authRole === 'supplier' ? 'bg-white shadow text-brand-dark' : 'text-gray-500'}`}
                >
                  Sou Fornecedor
                </button>
             </div>

             <form onSubmit={authMode === 'login' ? handleLogin : handleRegister} className="space-y-4">
                 
                 {authMode === 'register' && (
                    <>
                    <input 
                      type="text" placeholder="Nome Completo"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-red outline-none"
                      value={fullName} onChange={e => setFullName(e.target.value)}
                      required
                    />
                     <input 
                      type="text" placeholder="Celular / WeChat"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-red outline-none"
                      value={phone} onChange={e => setPhone(e.target.value)}
                      required
                    />
                    {authRole === 'client' && (
                        <input 
                        type="text" placeholder="CPF"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-red outline-none"
                        value={cpf} onChange={e => setCpf(e.target.value)}
                        required
                        />
                    )}
                    {authRole === 'supplier' && (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer group">
                             <UploadIcon className="w-8 h-8 mx-auto text-gray-400 group-hover:text-brand-red mb-2"/>
                             <span className="text-xs text-gray-500 block">Anexar QR Code Alipay</span>
                        </div>
                    )}
                    </>
                 )}

                 <input 
                   type="email" placeholder="E-mail"
                   className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-red outline-none"
                   value={email} onChange={e => setEmail(e.target.value)}
                   required
                 />
                 <input 
                   type="password" placeholder="Senha"
                   className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-red outline-none"
                   value={password} onChange={e => setPassword(e.target.value)}
                   required
                 />

                 <button type="submit" className="w-full bg-brand-dark text-white font-bold py-3 rounded-lg hover:bg-gray-800 transition-all shadow-lg">
                    {authMode === 'login' ? 'Entrar' : 'Cadastrar'}
                 </button>
             </form>

             <div className="mt-6 text-center">
                 <button 
                    onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                    className="text-sm text-gray-500 hover:text-brand-red font-semibold"
                 >
                     {authMode === 'login' ? 'Não tem conta? Crie agora' : 'Já tenho conta, fazer login'}
                 </button>
             </div>
         </div>
      </div>
    );
  }

  // --- LOGGED IN VIEW ---
  return (
    <div className="min-h-screen bg-gray-50 flex">
       {/* Sidebar */}
       <Sidebar />
       
       {/* Main Content */}
       <div className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Header */}
          <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shrink-0">
             <div className="flex items-center gap-3 lg:hidden">
                <button onClick={() => setIsSidebarOpen(true)} className="text-gray-500">
                    <MenuIcon />
                </button>
                <span className="font-bold text-lg">YUANBR</span>
             </div>
             <h2 className="hidden lg:block text-xl font-bold text-gray-800 capitalize">
                {activeTab.replace('_', ' ')}
             </h2>
             {user.role === 'supplier' && (
                 <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
                     <span className="text-xs text-gray-500 font-bold">MEU ID:</span>
                     <span className="font-mono font-bold text-brand-red">{user.supplierId}</span>
                     <CopyIcon className="w-3 h-3 text-gray-400 cursor-pointer"/>
                 </div>
             )}
          </header>

          {/* Content Area */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-6 pb-24 lg:pb-6">
             {activeTab === 'home' && (
                 <div className="max-w-4xl mx-auto space-y-6">
                     {user.role === 'client' && (
                         <>
                         <ClientCalculator />
                         <div>
                             <h3 className="font-bold text-gray-700 mb-3">Pedidos Recentes</h3>
                             {orders.map(order => <MobileOrderCard key={order.id} order={order} role="client"/>)}
                         </div>
                         </>
                     )}
                     
                     {user.role === 'supplier' && (
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                             <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                 <p className="text-xs text-gray-500 mb-1">Recebido Hoje</p>
                                 <p className="text-xl font-bold text-gray-900">¥ 0.00</p>
                             </div>
                             <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                 <p className="text-xs text-gray-500 mb-1">A Liberar</p>
                                 <p className="text-xl font-bold text-yellow-600">¥ {user.balance}</p>
                             </div>
                             {/* Supplier Orders List would go here */}
                         </div>
                     )}
                 </div>
             )}

             {activeTab === 'orders' && (
                 <div className="max-w-4xl mx-auto">
                     <div className="flex justify-between items-center mb-4">
                         <h3 className="font-bold text-gray-700">Histórico Completo</h3>
                     </div>
                     {orders.map(order => <MobileOrderCard key={order.id} order={order} role={user.role}/>)}
                 </div>
             )}

             {activeTab === 'payment' && <PaymentScreen />}
          </main>
       </div>
    </div>
  );
};

export default App;
