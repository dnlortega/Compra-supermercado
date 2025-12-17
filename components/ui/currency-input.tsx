"use client";

import React, { useState, useEffect } from "react";
import { Input } from "./input";

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  onValueChange: (value: number) => void;
  value: number | string | null;
}

export function CurrencyInput({ onValueChange, value, ...props }: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState("");

  const format = (val: number | string | null) => {
    if (val === null || val === undefined || val === "") return "";
    
    let numericValue: number;
    if (typeof val === "string") {
        const clean = val.replace(/[^\d]/g, "");
        numericValue = parseInt(clean) / 100;
    } else {
        numericValue = val;
    }

    if (isNaN(numericValue)) return "";
    
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericValue);
  };

  useEffect(() => {
    setDisplayValue(format(value));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^\d]/g, "");
    
    if (rawValue === "") {
      setDisplayValue("");
      onValueChange(0);
      return;
    }

    const numericValue = parseInt(rawValue) / 100;
    setDisplayValue(format(numericValue));
    onValueChange(numericValue);
  };

  return (
    <Input
      {...props}
      type="text"
      inputMode="numeric"
      value={displayValue}
      onChange={handleChange}
    />
  );
}
