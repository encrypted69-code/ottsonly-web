import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';


const FilterControls = ({ 
  currency, 
  setCurrency, 
  paymentMethod, 
  setPaymentMethod,
  fiscalPeriod,
  setFiscalPeriod,
  dataMode,
  setDataMode,
  onRefresh
}) => {
  const currencyOptions = [
    { value: 'USD', label: 'USD ($)' },
    { value: 'EUR', label: 'EUR (€)' },
    { value: 'GBP', label: 'GBP (£)' },
    { value: 'INR', label: 'INR (₹)' }
  ];

  const paymentMethodOptions = [
    { value: 'all', label: 'All Methods' },
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'debit_card', label: 'Debit Card' },
    { value: 'upi', label: 'UPI' },
    { value: 'wallet', label: 'Wallet' },
    { value: 'net_banking', label: 'Net Banking' }
  ];

  const fiscalPeriodOptions = [
    { value: 'current_month', label: 'Current Month' },
    { value: 'last_month', label: 'Last Month' },
    { value: 'current_quarter', label: 'Current Quarter' },
    { value: 'last_quarter', label: 'Last Quarter' },
    { value: 'current_year', label: 'Current Year' },
    { value: 'custom', label: 'Custom Range' }
  ];

  return (
    <div className="bg-card rounded-lg p-4 border border-border shadow-card mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <Select
          label="Currency"
          options={currencyOptions}
          value={currency}
          onChange={setCurrency}
        />
        
        <Select
          label="Payment Method"
          options={paymentMethodOptions}
          value={paymentMethod}
          onChange={setPaymentMethod}
        />
        
        <Select
          label="Fiscal Period"
          options={fiscalPeriodOptions}
          value={fiscalPeriod}
          onChange={setFiscalPeriod}
        />

        <div className="flex flex-col">
          <label className="text-sm font-medium text-foreground mb-2">Data Mode</label>
          <div className="flex space-x-2">
            <Button
              variant={dataMode === 'realtime' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDataMode('realtime')}
              iconName="Zap"
              iconPosition="left"
              iconSize={14}
              className="flex-1"
            >
              Real-time
            </Button>
            <Button
              variant={dataMode === 'historical' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setDataMode('historical')}
              iconName="Clock"
              iconPosition="left"
              iconSize={14}
              className="flex-1"
            >
              Historical
            </Button>
          </div>
        </div>

        <div className="flex items-end">
          <Button
            variant="outline"
            size="default"
            onClick={onRefresh}
            iconName="RefreshCw"
            iconPosition="left"
            iconSize={16}
            fullWidth
          >
            Refresh Data
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterControls;