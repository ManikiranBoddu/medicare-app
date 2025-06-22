// src/components/MedicationForm.js
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import axios from 'axios';

const MedicationForm = ({ userId }) => {
  const [formData, setFormData] = useState({ name: '', dosage: '', frequency: '' });

  const mutation = useMutation(
    (data) => axios.post(`http://localhost:3001/api/medications/user/${userId}`, data),
    {
      onSuccess: () => {
        setFormData({ name: '', dosage: '', frequency: '' });
      },
    }
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '15px' }}>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Medication Name"
        required
      />
      <input
        type="text"
        name="dosage"
        value={formData.dosage}
        onChange={handleChange}
        placeholder="Dosage (e.g., 200mg)"
        required
      />
      <input
        type="text"
        name="frequency"
        value={formData.frequency}
        onChange={handleChange}
        placeholder="Frequency (e.g., Once a day)"
        required
      />
      <button type="submit" disabled={mutation.isLoading}>
        {mutation.isLoading ? 'Adding...' : 'Add Medication'}
      </button>
      {mutation.isError && <p className="error">{mutation.error.message}</p>}
    </form>
  );
};

export default MedicationForm;