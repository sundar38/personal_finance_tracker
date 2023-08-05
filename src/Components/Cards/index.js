import React from 'react'
import "./styles.css"
import { Card, Row, Space } from 'antd';
function Cards({income, expense, balance,showExpenseModal, showIncomeModal, handleIncomeCancel, handleExpenseCancel}) {
  return (
    <div>
        <Row className='rowstyle'>
        <Card className='cardstyle'  title="Current Balance"  style={{ width: 300 }}>
      <p>₹{balance}</p>
      <button className='cardbutton'>Reset Balance</button>
      
    </Card>
    <Card className='cardstyle' title="Total Income" style={{ width: 300 }}>
      <p>₹{income}</p>
      <button className='cardbutton' onClick={showIncomeModal}>Add Income</button>
    </Card>
    <Card className='cardstyle' title="Total expenses" style={{ width: 300 }}>
      <p>₹{expense}</p>
      <button className='cardbutton' onClick={showExpenseModal}>Add Expense</button>
    </Card>
    </Row>
    </div>
  )
}

export default Cards