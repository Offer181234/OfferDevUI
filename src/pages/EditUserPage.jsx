import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import "../css/EditUserPage.css";

const EditUserPage = () => {

const { id } = useParams();

const [isSidebarCollapsed,setIsSidebarCollapsed] = useState(false)
const [activeTab,setActiveTab] = useState("details")
const [openAdmin,setOpenAdmin] = useState(false)

const [form,setForm] = useState({
firstName:"",
lastName:"",
email:"",
role:"User",
isActive:true
})

const [modules,setModules] = useState({
affiliates:false,
advertisers:false
})


/* GET USER */

useEffect(()=>{

fetch(`https://localhost:7228/api/Users/${id}`)
.then(res=>res.json())
.then(data=>{
setForm({
firstName:data.firstName,
lastName:data.lastName,
email:data.email,
role:data.role,
isActive:data.isActive
})
})
.catch(err=>console.log(err))

},[id])


const handleChange=(e)=>{
setForm({
...form,
[e.target.name]:e.target.value
})
}

const toggle=(field)=>{
setForm({
...form,
[field]:!form[field]
})
}

const toggleModule=(module)=>{
setModules({
...modules,
[module]:!modules[module]
})
}


/* UPDATE USER */

const saveUser=()=>{

fetch(`https://localhost:7228/api/Users/${id}`,{

method:"PUT",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

firstName:form.firstName,
lastName:form.lastName,
email:form.email,
role:form.role,
isActive:form.isActive,
modifiedBy:"Admin"

})

})

.then(()=>{
alert("User Updated Successfully")
})

.catch(err=>console.log(err))

}


return(

<div className={`of-layout ${isSidebarCollapsed ? 'collapsed' : ''}`}>

<Sidebar isCollapsed={isSidebarCollapsed}/>

<section className="of-main">

<Header
isSidebarCollapsed={isSidebarCollapsed}
onToggleSidebar={()=>setIsSidebarCollapsed(c=>!c)}
/>

<div className="container-fluid mt-4">

<div className="d-flex justify-content-between align-items-center">

<h3 className="page-title">Update User</h3>

<div className="breadcrumb">
🏠 / Users / Manage Users / <b>Update User</b>
</div>

</div>

<hr/>


{/* Tabs */}

<div className="user-tabs">

<button
className={activeTab==="details"?"active":""}
onClick={()=>setActiveTab("details")}
>
User Details
</button>

<button
className={activeTab==="roles"?"active":""}
onClick={()=>setActiveTab("roles")}
>
Roles
</button>

</div>


{/* USER DETAILS */}

{activeTab==="details" && (

<div className="card user-card">

<h5>User Detail</h5>

<div className="user-grid">

<div>
<label>First Name</label>
<input name="firstName" value={form.firstName} onChange={handleChange}/>
</div>

<div>
<label>Last Name</label>
<input name="lastName" value={form.lastName} onChange={handleChange}/>
</div>

<div>
<label>Email</label>
<input name="email" value={form.email} onChange={handleChange}/>
</div>

</div>

<div className="toggle-row">

<label>
<input type="checkbox" checked={form.isActive} onChange={()=>toggle("isActive")}/>
<span>Is Active</span>
</label>

</div>

<div className="next-btn">
<button onClick={()=>setActiveTab("roles")}>Next</button>
</div>

</div>

)}


{/* ROLES */}

{activeTab==="roles" && (

<div className="card user-card">

<h5>User Roles</h5>

<div className="admin-module">

<div
className="admin-header"
onClick={()=>setOpenAdmin(!openAdmin)}
>
ADMINISTRATION ▼
</div>

{openAdmin && (

<div className="admin-body">

<label className="module-item">

<input
type="checkbox"
checked={modules.affiliates}
onChange={()=>toggleModule("affiliates")}
/>

Affiliates

</label>

<label className="module-item">

<input
type="checkbox"
checked={modules.advertisers}
onChange={()=>toggleModule("advertisers")}
/>

Advertisers

</label>

</div>

)}

</div>

{/* SAVE BUTTON */}

<div className="next-btn">
<button onClick={saveUser}>Save User</button>
</div>

</div>

)}

</div>

</section>

</div>

)

}

export default EditUserPage