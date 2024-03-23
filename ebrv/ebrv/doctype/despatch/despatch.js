// Copyright (c) 2024, Safwan Samsudeen and contributors
// For license information, please see license.txt

frappe.ui.form.on("Despatch", {
	async after_save(frm) {
		if (frm.doc.name != frm.doc.despatch_id) {
			frappe.set_route("Form", "Despatch", frm.doc.despatch_id);
		}
	},
});
