import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Dashboard from "../src/pages/Home"
export default function AppRoutes() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Dashboard/>} />
			</Routes>
		</BrowserRouter>
	
	)
}
