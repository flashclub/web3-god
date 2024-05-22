"use client";
import { useState, useEffect } from "react";
import { Input, Button } from "antd";

export default function Home() {
  const { TextArea } = Input;
  const [input, setInput] = useState("");
  const [tx, setTx] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [contract, setContract] = useState(false);
  const searchData = async () => {
    console.log("input: ", input);
    const { data } = await fetch(`/api/detect?input=${input}`, {
      method: "GET",
    }).then((response) => response.json());
    console.log("res--", data);
    const { isContract, tx = null } = data;
    console.log("tx: ", tx);
    if (tx) {
      setTx(tx);
    } else {
      setShowInfo(true);
      setContract(isContract);
    }
  };
  return (
    <main className="flex min-h-screen flex-col items-center  p-24">
      <Input
        placeholder="please enter address, contract or hash"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setShowInfo(false);
        }}
      ></Input>
      <Button onClick={searchData}>搜索</Button>
      {tx && (
        <div>
          <h3 className="text-lg">{input} is a hash</h3>
          <div className="break-all">
            <TextArea rows={10} value={tx}></TextArea>
          </div>
        </div>
      )}
      {showInfo && (
        <div>
          {input} is {contract ? "contract" : "address"}
        </div>
      )}
    </main>
  );
}
