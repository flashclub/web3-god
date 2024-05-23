"use client";
import { useState, useEffect } from "react";
import { Input, Spin } from "antd";

import { LoadingOutlined } from "@ant-design/icons";

import { MemoizedReactMarkdown } from "@/components/Markdown/MemoizedReactMarkdown";

const { Search } = Input;
export default function Home() {
  const { TextArea } = Input;
  const [input, setInput] = useState("");
  const [tx, setTx] = useState(null);
  const [abi, setAbi] = useState(null);
  const [text, setText] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showH3, setShowH3] = useState(false);
  const [contract, setContract] = useState(false);
  const searchData = async () => {
    setLoading(true);
    setTx(null);
    setShowInfo(false);
    setShowH3(false);
    setText("");
    const { data } = await fetch(`/api/detect?input=${input}`, {
      method: "GET",
    }).then((response) => response.json());
    const { isContract, tx = null, abi } = data;
    // 是 hash
    if (tx) {
      setTx(tx);
      setShowInfo(false);
      getTextSteam(tx, "hash");
    } else {
      // 是地址
      setAbi(null);
      setTx(null);
      setShowInfo(true);
      setContract(isContract);
      console.log("abi: ", abi);

      if (isContract) {
        setAbi(abi);
        getTextSteam(JSON.stringify(abi, null, 2), "contract");
      }
    }
    setShowH3(true);
    setLoading(false);
  };
  const getTextSteam = async (tx: any, type: string) => {
    setLoading(true);

    const response = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: tx, type }),
    });
    const data = response.body;
    // Ensure data is not null before proceeding
    if (!data) {
      setLoading(false);
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
      const chunkValue = decoder.decode(value);
      text += chunkValue;
      setText((prev) => text);
    }
    setLoading(false);

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
          setShowH3(false);
        }}
        onSearch={searchData}
        size="large"
        loading={loading}
      />

      {tx && (
        <div className="mt-2 w-full">
          {showH3 && (
            <h3 className="text-lg mb-2 break-all text-center">
              {input} is a hash
            </h3>
          )}
          <div className="flex flex-col lg:flex-row">
            <div className="flex-1">
              {loading ? (
                <Spin
                  indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
                />
              ) : (
                <MemoizedReactMarkdown className="break-words px-2">
                  {text}
                </MemoizedReactMarkdown>
              )}
            </div>
            <div className="break-all flex-1">
              <TextArea rows={35} value={tx}></TextArea>
            </div>
          </div>
        </div>
      )}
      {showInfo && (
        <div className="mt-2 w-full">
          {showH3 && (
            <h3 className="text-lg mb-2 mb-2 break-all text-center">
              {input} is {contract ? "contract" : "address"}
            </h3>
          )}
          <div className="flex flex-col lg:flex-row">
            <div className="flex-1">
              {loading ? (
                <Spin
                  indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
                />
              ) : (
                <MemoizedReactMarkdown className="break-words px-2">
                  {text}
                </MemoizedReactMarkdown>
              )}
            </div>
            {abi && (
              <div className="break-all flex-1">
                <TextArea
                  rows={35}
                  value={JSON.stringify(abi, null, 2)}
                ></TextArea>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
