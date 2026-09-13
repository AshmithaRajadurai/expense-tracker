import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ExpenseForm from '../components/ExpenseForm';
import { expenseAPI } from '../services/api';
import { PlusCircle, Pencil } from 'lucide-react';

const AddTransaction = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if we are in editing mode (state passed via router link)
  const editExpense = location.state?.editExpense || null;
  const isEditing = !!editExpense;

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError('');

    try {
      if (isEditing) {
        await expenseAPI.update(editExpense._id, formData);
      } else {
        await expenseAPI.create(formData);
      }
      
      // Navigate back to transactions list page
      navigate('/transactions');
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || 
        'Failed to save transaction. Please check your inputs and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-transaction-container">
      <div className="form-card-container">
        <div className="form-card-header">
          <div className="form-title-flex">
            {isEditing ? (
              <>
                <Pencil size={24} className="form-header-icon" />
                <h1>Edit Transaction</h1>
              </>
            ) : (
              <>
                <PlusCircle size={24} className="form-header-icon" />
                <h1>Add Transaction</h1>
              </>
            )}
          </div>
          <p className="form-card-subtitle">
            {isEditing 
              ? 'Update the details of your transaction below.' 
              : 'Enter details of your income or expense in Indian Rupees (₹).'}
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="form-card-body">
          <ExpenseForm
            initialData={editExpense}
            onSubmit={handleSubmit}
            submitText={isEditing ? 'Update Transaction' : 'Add Transaction'}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </div>
  );
};

export default AddTransaction;
