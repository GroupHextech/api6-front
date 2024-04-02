import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "../src/pages/Home"
import Dashboard from "../src/pages/Dashboard"

export default function AppRoutes() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Home/>} />
				<Route path="/dashboard" element={<Dashboard/>} />
			</Routes>
		</BrowserRouter>
	
	)
}
