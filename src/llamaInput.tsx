import React, { useState } from 'react';
import axios from 'axios';

const LlamaInput = ({ onSubmit }: { onSubmit: (input: string) => void }) => {
  const [input, setInput] = useState('');
  const [latestCommand, setLatestCommand] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (input.trim()) {
      setIsSubmitting(true);
      try {
        const response = await axios.post('/llama', { text: input });
        console.log("Response data:", response.data);
        //setLatestCommand(response.data.data.command);
        console.log("Response data command:", response.data.data.command);
        setLatestCommand(response.data.data.command); 
      } catch (error) {
        console.error('Error submitting llama:', error);
      } finally {
        setIsSubmitting(false);
        setInput('');
      }
      //onSubmit(input);
      
    }
  };

  return (
    <div>
          <div>
          <p className='llama-llama'>Llama Llama!</p>
        </div>
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={input}
        onChange={handleChange}
        placeholder="Describe what you'd like to have the robot do..."
        className='input-large'
      />
      <button type="submit" className='submit-button-llama'>Submit</button>
    </form>
    
    {isSubmitting && <p>Sometimes this takes a second...</p>}
    <div className='command-box-llama'>
    {latestCommand ? (
        <div>
          <h3>Latest Command:</h3>
          <p>{latestCommand}</p>
        </div>
      ) : (
        <div>
          <h3>No Command Executed Yet</h3>
        </div>
      )}
      </div>
      <p className="bottom-text">This box contains what llama told the robot to do, literally</p>
    </div>
  );
};

export default LlamaInput;
