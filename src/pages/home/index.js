import React, { useState } from 'react';
import {
  Button,
  InputGroup,
  FormControl,
  Container,
  Alert,
} from 'react-bootstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import useRedirectState from './hooks/redirectState'

export default function Home({ ...props }) {
  const reactApiUrl = process.env.REACT_APP_API_URL;
  const hostApiUrl = process.env.REACT_APP_HOSTING_URL;
  const { params } = props.match;
  const isRedirectMode = useRedirectState(params.uuid);
  const [model, setModel] = useState({url: '', isCopied: false, isShortUrl: false, error: '', pendingRequest: false});

  const onUrlChange = (e) => {
    setModel({url: e.target.value});
  };

  const onCopyToClipboard = (e) => {
    setModel({...model, isCopied: true});
    setTimeout(() => setModel({...model, isCopied: false}), 2000);
  };

  const handleSubmit = (e) => {
    setModel({...model, pendingRequest: true, error: ''});
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ link: model.url }),
    };

    fetch(reactApiUrl, requestOptions)
      .then((response) => response.json())
      .then((res) => setModel({...model, url: `${hostApiUrl}/${res.uuid}`, isShortUrl: true, pendingRequest: false}))
      .catch((err) => {
        const errorMessage = 
          err.message === 'Failed to fetch' ? 
            `Shortner API unavailable. Please check access to ${reactApiUrl}` 
            : 'Please provide properly formatted URL.';
            setModel({...model, error: errorMessage, pendingRequest: false});
      });
  };

  return (
    <>
      {!isRedirectMode && (
          <Container className="col-lg-7 position-relative">
            <InputGroup>
              <FormControl
                placeholder="Type URL address"
                value={model.url}
                disabled={model.pendingRequest}
                onChange={onUrlChange}
              />
              {model.isShortUrl ? (
                <CopyToClipboard text={model.url} onCopy={onCopyToClipboard}>
                  <Button variant={model.isCopied ? 'success' : 'primary'}>
                    {model.isCopied ? 'Copied!' : 'Copy'}
                  </Button>
                </CopyToClipboard>
              ) : (
                <Button
                  variant="primary"
                  disabled={!model.url || model.pendingRequest}
                  onClick={handleSubmit}
                >
                  Shorten
                </Button>
              )}
            </InputGroup>
            {model.error && (<Alert variant="danger" className="position-absolute w-100 mt-3">
              {model.error}
            </Alert>
            )}
          </Container>
      )}
    </>
  );
}
