
import React, { useState, useEffect } from 'react';
import { CONTENT, EXCHANGE_RATE, TRANSACTION_FEE_PERCENT } from '../constants';
import { Language } from '../types';

interface CalculatorProps {
  lang: Language;
  customFeePercent?: number;
  hideTitle?: boolean;
}

const Calculator: React.FC<CalculatorProps> = ({ lang, customFeePercent, hideTitle }) => {
  const content = CONTENT[lang].calculator;
  const [yuanAmount, setYuanAmount] = useState<string>('1000');
  const [brlTotal, setBrlTotal] = useState<number>(0);
  const [feeAmountBrl, setFeeAmountBrl] = useState<number>(0);
  
  // Use custom fee if provided, otherwise default to constant
  const activeFee = customFeePercent !== undefined ? customFeePercent : TRANSACTION_FEE_PERCENT;

  const calculate = () => {
    const amount = parseFloat(yuanAmount);
    if (isNaN(amount)) {
        setBrlTotal(0);
        setFeeAmountBrl(0);
        return;
    }
    
    // 1. Convert Input Yuan to Base BRL
    const baseBrl = amount * EXCHANGE_RATE;
    
    // 2. Calculate Fee on the BRL amount using active fee
    const feeBrl = baseBrl * activeFee;
    
    // 3. Total BRL to be paid
    const totalBrl = baseBrl + feeBrl;

    setFeeAmountBrl(feeBrl);
    setBrlTotal(totalBrl);
  };

  useEffect(() => {
    calculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yuanAmount, activeFee]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 w-full relative z-10">
      {!hideTitle && (
        <>
        <div className="absolute -top-4 -right-4 bg-brand-gold text-brand-dark font-bold px-4 py-1 rounded-full text-sm shadow-md animate-pulse">
            Live Rates
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6">{content.title}</h3>
        </>
      )}
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {content.inputLabel}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">¥</span>
            <input
              type="number"
              value={yuanAmount}
              onChange={(e) => setYuanAmount(e.target.value)}
              className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-red focus:border-brand-red outline-none transition-all text-lg font-bold text-gray-900"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg space-y-2 border border-gray-200">
          <div className="flex justify-between text-sm text-gray-600">
            <span>{content.rateLabel}</span>
            <span className="font-mono">1 CNY ≈ {EXCHANGE_RATE.toFixed(2)} BRL</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Taxa YUANBR ({(activeFee * 100).toFixed(1)}%)</span>
            <span className="font-mono text-brand-darkRed font-semibold">R$ {feeAmountBrl.toFixed(2)}</span>
          </div>
          <div className="h-px bg-gray-300 my-2"></div>
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-800">{content.outputLabel}</span>
            <span className="text-2xl font-black text-brand-red">
              R$ {brlTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {!hideTitle && (
            <button 
            onClick={calculate}
            className="w-full bg-brand-red hover:bg-brand-darkRed text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg active:scale-95 transform duration-150"
            >
            {content.calculateButton}
            </button>
        )}
        
        <p className="text-xs text-gray-400 text-center mt-2">
          {content.disclaimer}
        </p>
      </div>
    </div>
  );
};

export default Calculator;
