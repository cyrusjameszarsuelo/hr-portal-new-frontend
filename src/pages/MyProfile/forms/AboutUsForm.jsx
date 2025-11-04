import React, { useEffect, useState } from "react";
import CustomModal from "../../../components/CustomModal";
import { useNavigate } from "react-router";
import { addAbout, getAboutEdit } from "../../../utils/about";
import FormActionBar from "../../../components/FormActionBar";

// A compact red-accent section title, consistent with JobProfile visuals
function SectionTitle({ children }) {
	return (
		<h2 className="text-lg font-semibold text-[#ee3124] flex items-center gap-2">
			<span className="inline-block w-1 h-6 bg-red-600 rounded-full" />
			{children}
		</h2>
	);
}

export default function AboutUsForm({ profileId, onSaved, onPrev, onNext, prevDisabled, nextDisabled }) {
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [showSuccessModal, setShowSuccessModal] = useState(false);
	const navigate = useNavigate();

	// Main About form state matching the provided schema
	const [form, setForm] = useState({
		birthdate: "",
		marital_status: "",
		// simple array of objects to preserve ids when editing
		interests: [], // [{ id?, interest }]
		educProfBackgrounds: [
			// { id?, education_level, school, course, start_date, end_date, honors, licAndCerts: [{ id?, lic_and_cert }] }
		],
		megawideWorkExperiences: [
			// { id?, position, department, rank, start_date }
		],
		prevWorkExperiences: [
			// { id?, position, megawide_position_equivalent, department, company, rank, functions_jd, start_date, end_date }
		],
		technicalProficiencies: [
			// { id?, skills, proficiency }
		],
		languageProficiencies: [
			// { id?, language, written, w_prof, spoken, s_prof }
		],
	});

	// Helpers to update nested arrays cleanly
	const updateField = (key, value) => setForm((p) => ({ ...p, [key]: value }));

	const addRow = (key, template) =>
		setForm((p) => ({ ...p, [key]: [...(p[key] || []), template] }));

	const removeRow = (key, index) =>
		setForm((p) => ({ ...p, [key]: (p[key] || []).filter((_, i) => i !== index) }));

	const updateRow = (key, index, field, value) =>
		setForm((p) => ({
			...p,
			[key]: (p[key] || []).map((row, i) => (i === index ? { ...row, [field]: value } : row)),
		}));

	// Note: Nested helpers for arrays are omitted now; only education.licAndCerts is nested and handled inline.

	// Load existing About data if available
	useEffect(() => {
		const load = async () => {
			try {
				setLoading(true);
				const editData = await getAboutEdit(profileId);

				// Shape the incoming edit data defensively
				const about = editData?.about || {};
				const interests = Array.isArray(about.interests)
					? about.interests.map((i) =>
						  typeof i === "string" ? { interest: i } : { id: i?.id, interest: i?.interest ?? "" },
					  )
					: [];

				// Map all education/professional background records
				const educProfBackgrounds = Array.isArray(about.educ_prof_backgrounds)
					? about.educ_prof_backgrounds.map((e) => ({
						  id: e?.id,
						  education_level: e?.education_level ?? "",
						  school: e?.school ?? "",
						  course: e?.course ?? "",
						  start_date: e?.start_date ?? "",
						  end_date: e?.end_date ?? "",
						  honors: e?.honors ?? "",
						  licAndCerts: Array.isArray(e?.lic_and_certs)
							  ? e.lic_and_certs.map((l) => ({ id: l?.id, lic_and_cert: l?.lic_and_cert ?? "" }))
							  : [],
					  }))
					: [];

				const megawideExps = Array.isArray(about.megawide_work_experiences)
					? about.megawide_work_experiences.map((w) => ({
						  id: w?.id,
						  position: w?.position ?? "",
						  department: w?.department ?? "",
						  rank: w?.rank ?? "",
						  start_date: w?.start_date ?? "",
					  }))
					: [];

				const prevExps = Array.isArray(about.prev_work_exp)
					? about.prev_work_exp.map((w) => ({
						  id: w?.id,
						  position: w?.position ?? "",
						  megawide_position_equivalent: w?.megawide_position_equivalent ?? "",
						  department: w?.department ?? "",
						  company: w?.company ?? "",
						  rank: w?.rank ?? "",
						  functions_jd: w?.functions_jd ?? "",
						  start_date: w?.start_date ?? "",
						  end_date: w?.end_date ?? "",
					  }))
					: [];

				const techs = Array.isArray(about.technical_proficiencies)
					? about.technical_proficiencies.map((t) => ({
						  id: t?.id,
						  skills: t?.skills ?? "",
						  proficiency: t?.proficiency ?? "",
					  }))
					: [];

				const langs = Array.isArray(about.language_proficiencies)
					? about.language_proficiencies.map((l) => ({
						  id: l?.id,
						  language: l?.language ?? "",
						  written: Boolean(l?.written),
						  w_prof: l?.w_prof ?? "",
						  spoken: Boolean(l?.spoken),
						  s_prof: l?.s_prof ?? "",
					  }))
					: [];

				setForm({
					birthdate: about?.birthdate ?? "",
					marital_status: about?.marital_status ?? "",
					interests,
					educProfBackgrounds,
					megawideWorkExperiences: megawideExps,
					prevWorkExperiences: prevExps,
					technicalProficiencies: techs,
					languageProficiencies: langs,
				});
			} catch (e) {
				console.error("Failed loading About data:", e);
			} finally {
				setLoading(false);
			}
		};
		load();
	}, [profileId]);

	const proficiencyOptions = ["Beginner", "Intermediate", "Advanced", "Expert"];
	const langLevelOptions = ["Beginner", "Intermediate", "Advanced", "Native"];

	async function handleSave() {
		// Build payload in snake_case matching backend schema names
		const payload = {
			org_structure_id: Number(profileId),
			birthdate: form.birthdate || "",
			marital_status: form.marital_status || "",
			interests: (form.interests || []).map((i) => ({
				...(i.id ? { id: i.id } : {}),
				interest: i.interest || "",
			})),
			// Map all education/professional backgrounds
			educ_prof_backgrounds: (form.educProfBackgrounds || []).map((e) => ({
				...(e.id ? { id: e.id } : {}),
				education_level: e.education_level || "",
				school: e.school || "",
				course: e.course || "",
				start_date: e.start_date || "",
				end_date: e.end_date || "",
				honors: e.honors || "",
				lic_and_certs: (e.licAndCerts || []).map((l) => ({
					...(l.id ? { id: l.id } : {}),
					lic_and_cert: l.lic_and_cert || "",
				})),
			})),
			megawide_work_experiences: (form.megawideWorkExperiences || []).map((w) => ({
				...(w.id ? { id: w.id } : {}),
				position: w.position || "",
				department: w.department || "",
				rank: w.rank || "",
				start_date: w.start_date || "",
			})),
			prev_work_exp: (form.prevWorkExperiences || []).map((w) => ({
				...(w.id ? { id: w.id } : {}),
				position: w.position || "",
				megawide_position_equivalent: w.megawide_position_equivalent || "",
				department: w.department || "",
				company: w.company || "",
				rank: w.rank || "",
				functions_jd: w.functions_jd || "",
				start_date: w.start_date || "",
				end_date: w.end_date || "",
			})),
			technical_proficiencies: (form.technicalProficiencies || []).map((t) => ({
				...(t.id ? { id: t.id } : {}),
				skills: t.skills || "",
				proficiency: t.proficiency || "",
			})),
			language_proficiencies: (form.languageProficiencies || []).map((l) => ({
				...(l.id ? { id: l.id } : {}),
				language: l.language || "",
				written: Boolean(l.written),
				w_prof: l.written ? (l.w_prof || "") : null,
				spoken: Boolean(l.spoken),
				s_prof: l.spoken ? (l.s_prof || "") : null,
			})),
		};

		setSaving(true);
		try {
			await addAbout(payload);
			if (onSaved) onSaved();
			setShowSuccessModal(true);
		} catch (e) {
			console.error("Failed to save About:", e);
		} finally {
			setSaving(false);
		}
	}

	if (loading) {
		return (
			<div className="flex items-center justify-center py-8">
				<div className="text-gray-500">Loading...</div>
			</div>
		);
	}

	return (
		<>
			{/* Success Modal */}
			<CustomModal
				isOpen={showSuccessModal}
				onClose={() => {
					setShowSuccessModal(false);
					navigate(-1);
				}}
				title="About Details Saved"
			>
				<div className="space-y-4">
					<p className="text-gray-700">Your "About" details have been saved successfully.</p>
					<div className="flex justify-end gap-2">
						<button
							type="button"
							onClick={() => {
								setShowSuccessModal(false);
								navigate(-1);
							}}
							className="px-5 py-2 bg-[#ee3124] text-white rounded-md hover:bg-red-600"
						>
							Go to My Profile
						</button>
					</div>
				</div>
			</CustomModal>

			{/* About Me */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
				<div className="bg-white border border-gray-200 shadow-xl rounded-lg p-4">
					<SectionTitle>About Me</SectionTitle>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
						<div className="md:col-span-1">
							<label className="block text-sm/6 font-medium text-gray-700">Birthdate</label>
							<input
								type="date"
								value={form.birthdate}
								onChange={(e) => updateField("birthdate", e.target.value)}
								className="mt-2 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
								placeholder="YYYY-MM-DD"
							/>
						</div>
						<div className="md:col-span-1">
							<label className="block text-sm/6 font-medium text-gray-700">Marital Status</label>
							<input
								type="text"
								value={form.marital_status}
								onChange={(e) => updateField("marital_status", e.target.value)}
								className="mt-2 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
								placeholder="e.g., Single / Married / Widowed"
							/>
						</div>
					</div>

					{/* Interests */}
					<div className="mt-6">
						<div className="flex items-center justify-between mb-2">
							<label className="block text-sm/6 font-medium text-gray-700">Interests</label>
							<button
								type="button"
								onClick={() => addRow("interests", { interest: "" })}
								className="px-2.5 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium rounded-md"
							>
								+ Add Interest
							</button>
						</div>
						{form.interests?.length ? (
							<div className="space-y-2">
								{form.interests.map((it, idx) => (
									<div key={idx} className="flex items-center gap-2">
										<input
											type="text"
											value={it.interest}
											onChange={(e) => updateRow("interests", idx, "interest", e.target.value)}
											className="w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-3 py-2 shadow-sm sm:text-sm"
											placeholder="e.g., Photography"
										/>
										<button
											type="button"
											onClick={() => removeRow("interests", idx)}
											className="text-red-600 hover:text-red-800 text-xs font-medium"
										>
											Remove
										</button>
									</div>
								))}
							</div>
						) : (
							<div className="text-gray-500 text-sm">No interests yet.</div>
						)}
					</div>
				</div>

				{/* Educational and Professional Background (multiple entries) */}
				<div className="bg-white border border-gray-200 shadow-xl rounded-lg p-4">
					<SectionTitle>Educational and Professional Background</SectionTitle>
					<div className="mt-3">
						<div className="flex items-center justify-between mb-2">
							<span className="text-sm text-gray-600">Add your education and professional backgrounds</span>
							<button
								type="button"
								onClick={() =>
									addRow("educProfBackgrounds", {
										education_level: "",
										school: "",
										course: "",
										start_date: "",
										end_date: "",
										honors: "",
										licAndCerts: [],
									})
								}
								className="px-2.5 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium rounded-md"
							>
								+ Add Entry
							</button>
						</div>

						{form.educProfBackgrounds?.length ? (
							<div className="space-y-4">
								{form.educProfBackgrounds.map((e, eIdx) => (
									<div key={eIdx} className="border border-gray-200 rounded-md p-3">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
											<div>
												<label className="block text-xs font-medium text-gray-700">Education Level</label>
												<select
													value={e.education_level}
													onChange={(ev) => updateRow("educProfBackgrounds", eIdx, "education_level", ev.target.value)}
													className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
												>
													<option value="">Select level...</option>
													<option value="primary">Primary</option>
													<option value="secondary">Secondary</option>
													<option value="tertiary">Tertiary</option>
													<option value="vocational">Vocational</option>
													<option value="undergraduate">Undergraduate</option>
													<option value="bachelors">Bachelor's</option>
													<option value="masters">Master's</option>
													<option value="doctorate">Doctorate</option>
												</select>
											</div>
											<div>
												<label className="block text-xs font-medium text-gray-700">School</label>
												<input
													type="text"
													value={e.school}
													onChange={(ev) => updateRow("educProfBackgrounds", eIdx, "school", ev.target.value)}
													className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
													placeholder="e.g., ABC University"
												/>
											</div>
											<div>
												<label className="block text-xs font-medium text-gray-700">Course</label>
												<input
													type="text"
													value={e.course}
													onChange={(ev) => updateRow("educProfBackgrounds", eIdx, "course", ev.target.value)}
													className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
													placeholder="e.g., Computer Science"
												/>
											</div>
											<div>
												<label className="block text-xs font-medium text-gray-700">Start Date</label>
												<input
													type="date"
													value={e.start_date}
													onChange={(ev) => updateRow("educProfBackgrounds", eIdx, "start_date", ev.target.value)}
													className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
												/>
											</div>
											<div>
												<label className="block text-xs font-medium text-gray-700">End Date</label>
												<input
													type="date"
													value={e.end_date}
													onChange={(ev) => updateRow("educProfBackgrounds", eIdx, "end_date", ev.target.value)}
													className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
												/>
											</div>
											<div className="md:col-span-2">
												<label className="block text-xs font-medium text-gray-700">Honors</label>
												<textarea
													rows={2}
													value={e.honors}
													onChange={(ev) => updateRow("educProfBackgrounds", eIdx, "honors", ev.target.value)}
													className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
													placeholder="e.g., Cum Laude, Dean's List, etc."
												/>
											</div>
										</div>

										{/* Licenses and Certifications for this entry */}
										<div className="mt-3">
											<div className="flex items-center justify-between mb-2">
												<span className="text-xs font-semibold text-gray-700">Licenses and Certifications</span>
												<button
													type="button"
													onClick={() =>
														setForm((p) => ({
															...p,
															educProfBackgrounds: (p.educProfBackgrounds || []).map((n, ni) =>
																ni === eIdx
																	? { ...n, licAndCerts: [...(n.licAndCerts || []), { lic_and_cert: "" }] }
																	: n,
															),
														}))
													}
													className="px-2 py-1 bg-gray-600 hover:bg-gray-700 text-white text-[11px] font-medium rounded-md"
												>
													+ Add License/Cert
												</button>
											</div>

											{(e.licAndCerts || []).length ? (
												<div className="space-y-2">
													{e.licAndCerts.map((l, lIdx) => (
														<div key={lIdx} className="flex items-center gap-2">
															<input
																type="text"
																value={l.lic_and_cert}
																onChange={(ev) =>
																	setForm((p) => ({
																		...p,
																		educProfBackgrounds: (p.educProfBackgrounds || []).map((n, ni) =>
																			ni === eIdx
																				? {
																					  ...n,
																					  licAndCerts: (n.licAndCerts || []).map((c, ci) =>
																						  ci === lIdx ? { ...c, lic_and_cert: ev.target.value } : c,
																					  ),
																				  }
																				: n,
																		),
																	}))
																}
																className="w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
																placeholder="e.g., PRC License No. ..."
															/>
															<button
																type="button"
																onClick={() =>
																	setForm((p) => ({
																		...p,
																		educProfBackgrounds: (p.educProfBackgrounds || []).map((n, ni) =>
																			ni === eIdx
																				? { ...n, licAndCerts: (n.licAndCerts || []).filter((_, ci) => ci !== lIdx) }
																				: n,
																		),
																	}))
																}
																className="text-red-600 hover:text-red-800 text-xs font-medium"
															>
																Remove
															</button>
														</div>
													))}
												</div>
											) : (
												<div className="text-gray-500 text-xs">No licenses/certifications yet.</div>
											)}
										</div>

										<div className="mt-3 text-right">
											<button
												type="button"
												onClick={() => removeRow("educProfBackgrounds", eIdx)}
												className="text-red-600 hover:text-red-800 text-xs font-medium"
											>
												Remove Entry
											</button>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="text-gray-500 text-sm">No educational or professional background entries yet.</div>
						)}
					</div>
				</div>
			</div>

			{/* Work Experience */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
				{/* Megawide Work Experience */}
				<div className="bg-white border border-gray-200 shadow-xl rounded-lg p-4">
					<SectionTitle>My Megawide Work Experience</SectionTitle>
					<div className="mt-3">
						<div className="flex items-center justify-between mb-2">
							<span className="text-sm text-gray-600">Add your Megawide assignments</span>
							<button
								type="button"
								onClick={() =>
									addRow("megawideWorkExperiences", {
										position: "",
										department: "",
										rank: "",
										start_date: "",
									})
								}
								className="px-2.5 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium rounded-md"
							>
								+ Add Work
							</button>
						</div>

						{form.megawideWorkExperiences?.length ? (
							<div className="space-y-3">
								{form.megawideWorkExperiences.map((w, wIdx) => (
									<div key={wIdx} className="border border-gray-200 rounded-md p-3">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
											<div>
												<label className="block text-xs font-medium text-gray-700">Position</label>
												<input
													type="text"
													value={w.position}
													onChange={(ev) => updateRow("megawideWorkExperiences", wIdx, "position", ev.target.value)}
													className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
													placeholder="e.g., Software Engineer"
												/>
											</div>
											<div>
												<label className="block text-xs font-medium text-gray-700">Department</label>
												<input
													type="text"
													value={w.department}
													onChange={(ev) => updateRow("megawideWorkExperiences", wIdx, "department", ev.target.value)}
													className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
													placeholder="e.g., IT Department"
												/>
											</div>
											<div>
												<label className="block text-xs font-medium text-gray-700">Rank</label>
												<input
													type="text"
													value={w.rank}
													onChange={(ev) => updateRow("megawideWorkExperiences", wIdx, "rank", ev.target.value)}
													className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
													placeholder="e.g., Officer"
												/>
											</div>
											<div>
												<label className="block text-xs font-medium text-gray-700">Start Date</label>
												<input
													type="date"
													value={w.start_date}
													onChange={(ev) => updateRow("megawideWorkExperiences", wIdx, "start_date", ev.target.value)}
													className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
												/>
											</div>
										</div>
										<div className="mt-2 text-right">
											<button
												type="button"
												onClick={() => removeRow("megawideWorkExperiences", wIdx)}
												className="text-red-600 hover:text-red-800 text-xs font-medium"
											>
												Remove Work
											</button>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="text-gray-500 text-sm">No Megawide work experience yet.</div>
						)}
					</div>
				</div>

				{/* Previous Work Experience */}
				<div className="bg-white border border-gray-200 shadow-xl rounded-lg p-4">
					<SectionTitle>My Previous Work Experience</SectionTitle>
					<div className="mt-3">
						<div className="flex items-center justify-between mb-2">
							<span className="text-sm text-gray-600">Add your prior roles</span>
							<button
								type="button"
								onClick={() =>
									addRow("prevWorkExperiences", {
										position: "",
										megawide_position_equivalent: "",
										department: "",
										company: "",
										rank: "",
										functions_jd: "",
										start_date: "",
										end_date: "",
									})
								}
								className="px-2.5 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium rounded-md"
							>
								+ Add Previous Work
							</button>
						</div>

						{form.prevWorkExperiences?.length ? (
							<div className="space-y-3">
								{form.prevWorkExperiences.map((w, wIdx) => (
									<div key={wIdx} className="border border-gray-200 rounded-md p-3">
										<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
											<div>
												<label className="block text-xs font-medium text-gray-700">Position</label>
												<input
													type="text"
													value={w.position}
													onChange={(ev) => updateRow("prevWorkExperiences", wIdx, "position", ev.target.value)}
													className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
													placeholder="e.g., Software Engineer"
												/>
											</div>
											<div>
												<label className="block text-xs font-medium text-gray-700">Company</label>
												<input
													type="text"
													value={w.company}
													onChange={(ev) => updateRow("prevWorkExperiences", wIdx, "company", ev.target.value)}
													className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
													placeholder="e.g., ABC Corporation"
												/>
											</div>
											<div>
												<label className="block text-xs font-medium text-gray-700">Department</label>
												<input
													type="text"
													value={w.department}
													onChange={(ev) => updateRow("prevWorkExperiences", wIdx, "department", ev.target.value)}
													className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
													placeholder="e.g., IT Department"
												/>
											</div>
											<div>
												<label className="block text-xs font-medium text-gray-700">Megawide Position Equivalent</label>
												<input
													type="text"
													value={w.megawide_position_equivalent}
													onChange={(ev) => updateRow("prevWorkExperiences", wIdx, "megawide_position_equivalent", ev.target.value)}
													className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
													placeholder="e.g., Senior Developer"
												/>
											</div>
											<div>
												<label className="block text-xs font-medium text-gray-700">Rank</label>
												<input
													type="text"
													value={w.rank}
													onChange={(ev) => updateRow("prevWorkExperiences", wIdx, "rank", ev.target.value)}
													className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
													placeholder="e.g., Senior Developer"
												/>
											</div>
											<div>
												<label className="block text-xs font-medium text-gray-700">Start Date</label>
												<input
													type="date"
													value={w.start_date}
													onChange={(ev) => updateRow("prevWorkExperiences", wIdx, "start_date", ev.target.value)}
													className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
												/>
											</div>
											<div>
												<label className="block text-xs font-medium text-gray-700">End Date</label>
												<input
													type="date"
													value={w.end_date}
													onChange={(ev) => updateRow("prevWorkExperiences", wIdx, "end_date", ev.target.value)}
													className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
												/>
											</div>
											<div className="md:col-span-2">
												<label className="block text-xs font-medium text-gray-700">Functions / Job Description</label>
												<textarea
													rows={2}
													value={w.functions_jd}
													onChange={(ev) => updateRow("prevWorkExperiences", wIdx, "functions_jd", ev.target.value)}
													className="mt-1 w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
													placeholder="Describe your roles and responsibilities..."
												/>
											</div>
										</div>
										<div className="mt-2 text-right">
											<button
												type="button"
												onClick={() => removeRow("prevWorkExperiences", wIdx)}
												className="text-red-600 hover:text-red-800 text-xs font-medium"
											>
												Remove Previous Work
											</button>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="text-gray-500 text-sm">No previous work experience yet.</div>
						)}
					</div>
				</div>
			</div>

			{/* Proficiencies */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				{/* Technical Proficiency */}
				<div className="bg-white border border-gray-200 shadow-xl rounded-lg p-4">
					<SectionTitle>Technical Proficiency</SectionTitle>
					<div className="mt-3">
						<div className="flex items-center justify-between mb-2">
							<span className="text-sm text-gray-600">List your technical skills</span>
							<button
								type="button"
								onClick={() => addRow("technicalProficiencies", { skills: "", proficiency: "" })}
								className="px-2.5 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium rounded-md"
							>
								+ Add Skill
							</button>
						</div>
						{form.technicalProficiencies?.length ? (
							<div className="space-y-2">
								{form.technicalProficiencies.map((t, tIdx) => (
									<div key={tIdx} className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center">
										<input
											type="text"
											value={t.skills}
											onChange={(ev) => updateRow("technicalProficiencies", tIdx, "skills", ev.target.value)}
											className="w-full rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
											placeholder="e.g., ReactJS"
										/>
										<select
											value={t.proficiency}
											onChange={(ev) => updateRow("technicalProficiencies", tIdx, "proficiency", ev.target.value)}
											className="w-full rounded-md bg-white border border-gray-300 text-gray-900 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
										>
											<option value="">Select proficiency…</option>
											{proficiencyOptions.map((opt) => (
												<option key={opt} value={opt}>{opt}</option>
											))}
										</select>
										<div className="md:col-span-2 text-right">
											<button
												type="button"
												onClick={() => removeRow("technicalProficiencies", tIdx)}
												className="text-red-600 hover:text-red-800 text-xs font-medium"
											>
												Remove Skill
											</button>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="text-gray-500 text-sm">No technical skills yet.</div>
						)}
					</div>
				</div>

				{/* Language Proficiency */}
				<div className="bg-white border border-gray-200 shadow-xl rounded-lg p-4">
					<SectionTitle>Language Proficiency</SectionTitle>
					<div className="mt-3">
						<div className="flex items-center justify-between mb-2">
							<span className="text-sm text-gray-600">Add languages you know</span>
							<button
								type="button"
								onClick={() => addRow("languageProficiencies", { language: "", written: false, w_prof: "", spoken: false, s_prof: "" })}
								className="px-2.5 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium rounded-md"
							>
								+ Add Language
							</button>
						</div>
								{form.languageProficiencies?.length ? (
									<div className="space-y-3">
										{form.languageProficiencies.map((l, lIdx) => (
											<div key={lIdx} className="border border-gray-200 rounded-md p-3">
												{/* Row 1: Language label and input inline */}
												<div className="flex items-center gap-3">
													<label className="text-xs font-medium text-gray-700 w-24">Language</label>
													<input
														type="text"
														value={l.language}
														onChange={(ev) => updateRow("languageProficiencies", lIdx, "language", ev.target.value)}
														className="flex-1 rounded-md bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs"
														placeholder="e.g., English"
													/>
												</div>

												{/* Row 2: Written and Spoken each with checkbox + dropdown, inline in one row */}
												<div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
													<div className="flex items-center gap-3">
														<label className="text-xs font-medium text-gray-700 flex items-center gap-2 m-0">
															<input
																type="checkbox"
																checked={!!l.written}
																onChange={(ev) => updateRow("languageProficiencies", lIdx, "written", ev.target.checked)}
																className="h-4 w-4 rounded border-gray-300 text-[#ee3124] focus:ring-[#ee3124]"
															/>
															Written
														</label>
														<select
															value={l.w_prof}
															onChange={(ev) => updateRow("languageProficiencies", lIdx, "w_prof", ev.target.value)}
															className="rounded-md bg-white border border-gray-300 text-gray-900 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs w-full"
															disabled={!l.written}
														>
															<option value="">Proficiency…</option>
															{langLevelOptions.map((opt) => (
																<option key={opt} value={opt}>{opt}</option>
															))}
														</select>
													</div>
													<div className="flex items-center gap-3">
														<label className="text-xs font-medium text-gray-700 flex items-center gap-2 m-0">
															<input
																type="checkbox"
																checked={!!l.spoken}
																onChange={(ev) => updateRow("languageProficiencies", lIdx, "spoken", ev.target.checked)}
																className="h-4 w-4 rounded border-gray-300 text-[#ee3124] focus:ring-[#ee3124]"
															/>
															Spoken
														</label>
														<select
															value={l.s_prof}
															onChange={(ev) => updateRow("languageProficiencies", lIdx, "s_prof", ev.target.value)}
															className="rounded-md bg-white border border-gray-300 text-gray-900 focus:border-[#ee3124] focus:ring-[#ee3124] px-2 py-1.5 shadow-sm text-xs w-full"
															disabled={!l.spoken}
														>
															<option value="">Proficiency…</option>
															{langLevelOptions.map((opt) => (
																<option key={opt} value={opt}>{opt}</option>
															))}
														</select>
													</div>
												</div>

												<div className="mt-2 text-right">
													<button
														type="button"
														onClick={() => removeRow("languageProficiencies", lIdx)}
														className="text-red-600 hover:text-red-800 text-xs font-medium"
													>
														Remove Language
													</button>
												</div>
											</div>
										))}
									</div>
								) : (
									<div className="text-gray-500 text-sm">No language proficiencies yet.</div>
								)}
					</div>
				</div>
			</div>

			{/* Actions */}
			<FormActionBar
				onPrev={onPrev}
				onNext={onNext}
				prevDisabled={prevDisabled}
				nextDisabled={nextDisabled}
				onSave={handleSave}
				saving={saving}
				saveLabel="Save About"
			/>
		</>
	);
}

