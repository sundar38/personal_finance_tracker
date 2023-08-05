import React, { useEffect, useState } from 'react'
import Header from '../Components/Header'
import Cards from '../Components/Cards'
import Modal from 'antd/es/modal/Modal'
import AddExpenseModal from '../Components/Modals/addExpense'
import AddIncomeModal from '../Components/Modals/addIncome'
import moment from "moment";
import { addDoc, collection, getDocs, query } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { toast } from 'react-toastify'
import TransactionTable from '../Components/TransactionsTable'
import { Chart } from 'chart.js'

function Dashboard() {
  const [transactions, setTransactions]=useState([])
  const [loading,setLoading]=useState(false)
  const [user]=useAuthState(auth)
  const [isExpenseModalVisible, setIsExpenseModalVisible]=useState(false)
  const [isIncomeModalVisible, setIsIncomeModalVisible]=useState(false)
  const [income, setIncome]=useState(0)
  const [expenses, setExpenses]=useState(0)
  const [currentBalance, setCurrentBalance]=useState(0)
  const showExpenseModal=()=>{
    setIsExpenseModalVisible(true)
  }
  const handleExpenseCancel=()=>{
    setIsExpenseModalVisible(false)
  }
  const showIncomeModal=()=>{
    setIsIncomeModalVisible(true)
  }
  const handleIncomeCancel=()=>{
    setIsIncomeModalVisible(false)
  }
  const onFinish=(values,type)=>{
    const newTransaction={
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };
    addTransaction(newTransaction)
  }
  async function addTransaction(transaction,many) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log(user)
      console.log("Document written with ID: ", docRef.id);
      transactions.push(transaction)
      setTransactions(transactions)
      calculateBalance()
      if (!many) {
        toast.success("Transaction Added!");
      }
    } catch (e) {
      console.error("Error adding document: ", e);
      if (!many) {
        toast.error("Couldn't add transaction");
      }
    }
  }
  useEffect(()=>{
    //get all docs from transaction
    fetchTransactions()
  },[user])
  useEffect(()=>{
    calculateBalance()
  },[transactions])

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expensesTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpenses(expensesTotal);
    setCurrentBalance(incomeTotal - expensesTotal);
    console.log(currentBalance);
  };

  async function fetchTransactions() {
    
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionsArray = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        transactionsArray.push(doc.data());
      });
      setTransactions(transactionsArray);
      //toast.success("Transactions Fetched!");
      console.log("Transaction array", transactions);
    }
    setLoading(false);
  }
  
  return (
    <div>
      <Header/>
      <Cards
        income={income}
        expense={expenses}
        balance={currentBalance}
        showExpenseModal={showExpenseModal}
        showIncomeModal={showIncomeModal}
        handleIncomeCancel={handleIncomeCancel}
        handleExpenseCancel={handleExpenseCancel}  
      />
      {/* {transactions.length!=0? <Chart/>:<h1> No transactions</h1>} */}
      
      <AddExpenseModal
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
      />
      <AddIncomeModal
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
      />
      <TransactionTable transaction={transactions} addTransaction={addTransaction} fetchTransactions={fetchTransactions}/>
    </div>
  )
}

export default Dashboard