import { Radio, Select, Table } from 'antd';
import React, { useState } from 'react'
import "./style.css"
import { Option } from 'antd/es/mentions';
import { parse, unparse } from 'papaparse';
import { toast } from 'react-toastify';
function TransactionTable({transaction, addTransaction, fetchTransactions}) {
  const {option}=Select
  const [sortKey, setSortKey]=useState("")
    const [search, setSearch]=useState()
    const [typeFilter, setTypeFilter]=useState("")
    const columns = [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: 'Amount',
          dataIndex: 'amount',
          key: 'amount',
        },
        {
          title: 'Date',
          dataIndex: 'date',
          key: 'date',
        },
        {
            title: 'Tag',
            dataIndex: 'tag',
            key: 'tag',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
      ];
      let filteredresults= transaction.filter((item)=>item.name.includes(search) && item.type.includes(typeFilter))
      const sortedtransactions= filteredresults.sort((a,b)=>{
        if(sortKey==="date")
          return new Date(a.date)-new Date(b.date)
        else if(sortKey==="amount")
          return a.amount-b.amount
        else  
          return 0;
      })
      function exporttocsv(){
        var csv = unparse({
          "fields": ["name", "amount", "date", "type", "tag"],
          data: transaction,
        });
        const blob=new Blob([csv],{type: "text/csv;charset=utf-8;"});
        const url=URL.createObjectURL(blob)
        const link=document.createElement("a")
        link.href=url;
        link.download="transactions.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
      
  function importFromCsv(event) {
    event.preventDefault();
    try {
      parse(event.target.files[0], {
        header: true,
        complete: async function (results) {
          console.log("Result is", results);
          // Now results.data is an array of objects representing your CSV rows
          for (const transaction of results.data) {
            // Write each transaction to Firebase, you can use the addTransaction function here
            console.log("Transactions", transaction);
            const newTransaction = {
              ...transaction,
              amount: parseFloat(transaction.amount),
            };
            await addTransaction(newTransaction, true);
          }
         },
      });
      toast.success("All Transactions Added");
       fetchTransactions();
      // event.target.files = null;
    } catch (e) {
      toast.error(e.message);
    }
  }
  return (  
    <div className='main'>
      <input className='searching' type="text" placeholder='Search any name' onChange={e=> setSearch(e.target.value)}></input>
      <Select
          className="select-input"
          onChange={(value) => setTypeFilter(value)}
          value={typeFilter}
          placeholder="Filter"
          allowClear
        >
          <Option value="">All</Option>
          <Option value="income">Income</Option>
          <Option value="expense">Expense</Option>
        </Select>
        <div className='content'>
          <div className='heading'>
          <h1>My Transactions</h1>
        <Radio.Group
            className="input-radio"
            onChange={(e) => setSortKey(e.target.value)}
            value={sortKey}
          >
            <Radio.Button value="">No Sort</Radio.Button>
            <Radio.Button value="date">Sort by Date</Radio.Button>
            <Radio.Button value="amount">Sort by Amount</Radio.Button>
          </Radio.Group>
          <button onClick={exporttocsv} className='csv'>Export to CSV</button>
          <label for="file-csv" className='csv big'>Import from CSV</label>
          <input id="file-csv" type='file' accept='.csv' required onChange={importFromCsv} style={{display:"none"}}></input>
          </div>
      <Table columns={columns} dataSource={sortedtransactions} />
      </div>
      </div>
  )
}

export default TransactionTable