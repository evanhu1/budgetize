"use client";

import Router from "next/router";
import { useState, useEffect, useCallback } from "react";
import { usePlaidLink } from "react-plaid-link";

export default function PlaidLink() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const createLinkToken = async () => {
      const response = await fetch("/api/create-link-token", {
        method: "GET",
      });
      const { link_token } = await response.json();
      setToken(link_token);
    };
    createLinkToken();
  }, []);

  const onSuccess = useCallback(async (publicToken: string) => {
    await fetch("/api/exchange-public-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ public_token: publicToken }),
    });
    Router.push("/dash");
  }, []);

  const { open, ready, error } = usePlaidLink({
    token,
    onSuccess,
    onExit: () => {
      console.log("onExit");
      console.log(error);
    },
    onEvent: (event, metadata) => {
      console.log(event);
      console.log(metadata);
      console.log(error);
    },
  });

  return (
    <button onClick={() => open()} disabled={!ready}>
      <strong>Link account</strong>
    </button>
  );
}
