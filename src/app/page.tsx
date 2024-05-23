"use client";
import { useState, useEffect } from "react";
import { Input, Row, Col } from "antd";

import { MemoizedReactMarkdown } from "@/components/Markdown/MemoizedReactMarkdown";

const { Search } = Input;
export default function Home() {
  const { TextArea } = Input;
  const [input, setInput] = useState("");
  const [tx, setTx] = useState(null);
  const [data, setData] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contract, setContract] = useState(false);
  const searchData = async () => {
    setLoading(true);
    console.log("input: ", input);
    const { data } = await fetch(`/api/detect?input=${input}`, {
      method: "GET",
    }).then((response) => response.json());
    console.log("res--", data);
    const { isContract, tx = null } = data;
    console.log("tx: ", tx);
    if (tx) {
      setTx(tx);
      setShowInfo(false);
      getTextSteam(tx);
    } else {
      setTx(null);
      setShowInfo(true);
      setContract(isContract);
    }
    setLoading(false);
  };
  const getTextSteam = async (tx: any) => {
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: tx }),
    });
    const data = response.body;
    // Ensure data is not null before proceeding
    if (!data) {
      throw new Error("Response body is null");
    }
    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let isFirst = true;
    let text = "";
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      console.log("done status-", done);
      const chunkValue = decoder.decode(value);
      text += chunkValue;
      console.log("text: ", text);
      setData((prev) => text);
    }
    return text;
  };
  return (
    <main className="flex min-h-screen flex-col items-center  p-4 lg:p-8">
      {/* <Input></Input> */}
      {/* <Button onClick={searchData}>搜索</Button> */}
      <Search
        enterButton="Search"
        placeholder="please enter address, contract or hash"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setTx(null);
          setShowInfo(false);
        }}
        onSearch={searchData}
        size="large"
        loading={loading}
      />
      {tx && (
        <div className="mt-2 w-full">
          <h3 className="text-lg mb-2">{input} is a hash</h3>
          <div className="flex flex-col lg:flex-row">
            <div className="break-all flex-1">
              <TextArea rows={30} value={tx}></TextArea>
            </div>
            <div className="flex-1 p-2">
              <MemoizedReactMarkdown className="break-all">
                {data}
              </MemoizedReactMarkdown>
            </div>
          </div>
        </div>
      )}
      {showInfo && (
        <div className="mt-2">
          <h3 className="text-lg mb-2">
            {input} is {contract ? "contract" : "address"}
          </h3>
        </div>
      )}
    </main>
  );
}
