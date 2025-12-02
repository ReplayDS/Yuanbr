import { ContentText } from './types';

// Hardcoded exchange rate for demo purposes
export const EXCHANGE_RATE = 0.82; // 1 CNY = 0.82 BRL (Approx)
export const TRANSACTION_FEE_PERCENT = 0.05; // 5%

export const CONTENT: Record<'pt' | 'cn', ContentText> = {
  pt: {
    nav: {
      clientLogin: "Login Cliente",
      supplierLogin: "Login Fornecedor",
      solutions: "Soluções",
      about: "Sobre Nós",
      contact: "Contato"
    },
    hero: {
      headline: "CHEGA DE SER ENGANADO POR FORNECEDORES NA CHINA.",
      subheadline: "O fornecedor sumiu com seu dinheiro? A carga veio errada? A YUANBR blinda seu capital. Nós só liberamos o pagamento quando sua mercadoria é conferida e entregue.",
      cta: "BLINDAR MINHA IMPORTAÇÃO",
      trustBadge: "Dinheiro retido em conta Escrow auditada no Brasil"
    },
    features: {
      title: "O ÚNICO MEIO SEGURO DE IMPORTAR",
      items: [
        {
          title: "Escrow de Verdade",
          description: "Seu dinheiro fica no Brasil. O chinês só vê a cor do dinheiro depois que você der o OK.",
          icon: 'lock'
        },
        {
          title: "Auditoria de Carga",
          description: "Verificamos se o que está no container é o que você comprou. Sem tijolo no lugar de iPhone.",
          icon: 'shield'
        },
        {
          title: "Câmbio Transparente",
          description: "Calculadora clara. Taxa fixa. Sem letras miúdas ou spreads ocultos que comem sua margem.",
          icon: 'speed'
        },
        {
          title: "Suporte em Português",
          description: "Resolvemos as broncas. Chega de falar inglês traduzido ou mandar e-mail para o vazio.",
          icon: 'support'
        }
      ]
    },
    calculator: {
      title: "Simule sua Remessa",
      inputLabel: "Valor a enviar (YUAN ¥)",
      outputLabel: "Custo total estimado (REAL R$)",
      feeLabel: "Taxa de Serviço (5%)",
      rateLabel: "Cotação Comercial",
      disclaimer: "*Valores estimados. O IOF pode variar de acordo com a natureza da operação.",
      calculateButton: "Simular Agora"
    },
    aiWidget: {
      title: "Consultor YUANBR (IA)",
      placeholder: "Tire dúvidas sobre segurança...",
      send: "Enviar",
      welcome: "Olá! Sou a IA da YUANBR. Como posso ajudar a proteger sua importação hoje?"
    }
  },
  cn: {
    nav: {
      clientLogin: "买家登录 (Client Login)",
      supplierLogin: "供应商登录 (Supplier Login)",
      solutions: "解决方案",
      about: "关于我们",
      contact: "联系方式"
    },
    hero: {
      headline: "连接巴西市场的最安全桥梁",
      subheadline: "通过YUANBR，向巴西客户销售变得更加简单安全。我们保证资金合规入境，消除信任障碍，让巴西买家更愿意向您下单。",
      cta: "开始安全收款",
      trustBadge: "受到数千家巴西进口商的信赖"
    },
    features: {
      title: "为什么选择 YUANBR?",
      items: [
        {
          title: "有保证的付款",
          description: "通过我们的托管系统建立信任。只要发货符合约定，资金保证到账。",
          icon: 'lock'
        },
        {
          title: "更多巴西客户",
          description: "巴西人害怕欺诈。使用YUANBR认证，您将获得更多订单。",
          icon: 'shield'
        },
        {
          title: "快速结算",
          description: "货物确认后，资金直接结算为人民币或美元，极速到账。",
          icon: 'speed'
        },
        {
          title: "本地支持",
          description: "我们在圣保罗和深圳均有团队，消除语言和时差障碍。",
          icon: 'support'
        }
      ]
    },
    calculator: {
      title: "汇率计算器",
      inputLabel: "收款金额 (YUAN ¥)",
      outputLabel: "巴西客户支付金额 (REAL R$)",
      feeLabel: "交易手续费 (5%)",
      rateLabel: "参考汇率",
      disclaimer: "*仅供参考，实际汇率以交易时为准。",
      calculateButton: "计算"
    },
    aiWidget: {
      title: "YUANBR 助手 (AI)",
      placeholder: "询问关于巴西市场的问题...",
      send: "发送",
      welcome: "您好！我是YUANBR助手。想了解如何更安全地向巴西销售吗？"
    }
  }
};