import React, { useState, useCallback } from 'react';
import styled from 'styled-components';


const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 12px;

  label {
    width: 10%;
    margin-right: 12px;
  }

  input {
    width: 25%;
    margin-right: 12px;
  }

  button {
    appearance: none;
    outline: none;
    border: none;
    background-color: #1991EB;
    color: white;
    padding: 4px 12px;
    height: 24px;
    font-size: 12px;
  }
`;

export default function UrlInputs({ onSubmit: onSubmitProp, defaultValues }) {
  const [urls, setUrls] = useState(defaultValues || {});

  const onChange = useCallback((e) => {
    setUrls(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }, []);

  const onSubmit = useCallback((e) => {
    e.preventDefault();
    onSubmitProp(urls);
  }, [onSubmitProp, urls]);

  return (
    <Form onSubmit={onSubmit}>
      <label htmlFor="audioUrl">Audio URL (https):</label>
      <input
        type="url"
        name="audioUrl"
        placeholder="https://example.com/file.wav"
        // pattern="https://.*"
        onChange={onChange}
        value={urls.audioUrl}
        required
      />

      <label htmlFor="transcriptUrl">Transcript URL (https):</label>
      <input
        type="text"
        name="transcriptUrl"
        placeholder="https://example.com/file.json"
        // pattern="https://.*"
        onChange={onChange}
        value={urls.transcriptUrl}
        required
      />

      <button type="submit">Update Urls</button>
    </Form>
  )
}
