import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

interface PriceFilterProps {
  value: [number, number] | null;
  onChange: (range: [number, number] | null) => void;
  maxAllowedPrice?: number;
}

const PriceFilter = ({ value, onChange, maxAllowedPrice = 10000 }: PriceFilterProps) => {
  const { toast } = useToast();
  const [minInput, setMinInput] = useState<string>('');
  const [maxInput, setMaxInput] = useState<string>('');

  // Update local inputs when external value changes
  useEffect(() => {
    if (value) {
      setMinInput(value[0]?.toString() || '');
      setMaxInput(value[1] === Infinity ? '' : value[1]?.toString() || '');
    } else {
      setMinInput('');
      setMaxInput('');
    }
  }, [value]);

  // Helper to format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Validate and update price range
  const updatePriceRange = (min: number | null, max: number | null) => {
    let newMin = min ?? (value?.[0] || 0);
    let newMax = max ?? (value?.[1] || Infinity);

    // Validate inputs
    if (newMin < 0) newMin = 0;
    if (newMax < 0) newMax = 0;
    if (newMax > maxAllowedPrice) newMax = maxAllowedPrice;

    // Ensure min doesn't exceed max
    if (newMin > newMax) {
      toast({
        description: "Minimum price cannot be greater than maximum price",
        variant: "destructive",
      });
      return;
    }

    onChange([newMin, newMax]);
  };

  const presetRanges = [
    { label: 'Up to $50', min: 0, max: 50 },
    { label: '$50 - $100', min: 50, max: 100 },
    { label: '$100 - $200', min: 100, max: 200 },
    { label: '$200 - $500', min: 200, max: 500 },
    { label: '$500+', min: 500, max: Infinity },
  ];

  return (
    <div>
      <span className="text-sm text-gray-600">Budget</span>
      <div className="flex gap-2 mt-2">
        <Select
          value={value ? value[0].toString() : ''}
          onValueChange={(val) => {
            const numVal = Number(val);
            if (!isNaN(numVal)) {
              updatePriceRange(numVal, null);
            }
          }}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Min Price">
              {value?.[0] ? formatPrice(value[0]) : 'Min Price'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <div className="flex px-3 pb-2">
              <Input
                type="number"
                placeholder="Custom min"
                value={minInput}
                onChange={(e) => {
                  const val = e.target.value;
                  setMinInput(val);
                  const numVal = Number(val);
                  if (!isNaN(numVal)) {
                    updatePriceRange(numVal, null);
                  }
                }}
                className="w-full"
              />
            </div>
            {presetRanges.map((range) => (
              <SelectItem key={range.min} value={range.min.toString()}>
                {formatPrice(range.min)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={value && value[1] !== Infinity ? value[1].toString() : ''}
          onValueChange={(val) => {
            const numVal = Number(val);
            if (!isNaN(numVal)) {
              updatePriceRange(null, numVal);
            }
          }}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Max Price">
              {value?.[1] === Infinity ? 'Any' : value?.[1] ? formatPrice(value[1]) : 'Max Price'}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <div className="flex px-3 pb-2">
              <Input
                type="number"
                placeholder="Custom max"
                value={maxInput}
                onChange={(e) => {
                  const val = e.target.value;
                  setMaxInput(val);
                  const numVal = Number(val);
                  if (!isNaN(numVal)) {
                    updatePriceRange(null, numVal);
                  }
                }}
                className="w-full"
              />
            </div>
            {presetRanges.map((range) => (
              <SelectItem key={range.max} value={range.max.toString()}>
                {range.max === Infinity ? 'Any' : formatPrice(range.max)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {value && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              onChange(null);
              setMinInput('');
              setMaxInput('');
            }}
            className="h-10 w-10"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default PriceFilter;