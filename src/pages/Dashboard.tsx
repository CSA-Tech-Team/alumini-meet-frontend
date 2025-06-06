"use client"

import type React from "react"
import { useApi } from "@/apis/useApi"
import { HttpMethod, ApiEndpoints } from "@/apis/apis.enum"
import type { UseMutationResult, UseQueryResult } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { toast } from "sonner"
import type {
    GetAllEventsResponse,
    GetUserActivitiesResponse,
    SingingRequest,
    SingingResponse,
} from "@/apis/apis.interface"
import { useState, useEffect } from "react"
import { CalendarDays, Music, Users, PlusCircle, X, Check, Loader2, LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { localStorageService } from "@/services/localStorage.service"

// Fetch the user's participated events and singing activities
const useUserActivities = (): UseQueryResult<GetUserActivitiesResponse, Error> => {
    return useApi<GetUserActivitiesResponse>(HttpMethod.GET, true, "getUserActivities", {
        url: ApiEndpoints.GET_USER_ACTIVITIES,
    }) as UseQueryResult<GetUserActivitiesResponse, Error>
}

// Hook to register for an event
const useRegisterForEvent = (
    eventId: string,
): UseMutationResult<null, AxiosError<{ message: string }>, void, unknown> => {
    return useApi<null, void>(HttpMethod.POST, true, `registerEvent-${eventId}`, {
        url: `${ApiEndpoints.REGISTER_EVENT}/${eventId}/join`,
    }) as UseMutationResult<null, AxiosError<{ message: string }>, void, unknown>
}

// Add a new singing activity
const useAddSinging = (): UseMutationResult<
    SingingResponse,
    AxiosError<{ message: string }>,
    SingingRequest,
    unknown
> => {
    return useApi<SingingResponse, SingingRequest>(HttpMethod.POST, true, "addSinging", {
        url: ApiEndpoints.ADD_SINGING,
    }) as UseMutationResult<SingingResponse, AxiosError<{ message: string }>, SingingRequest, unknown>
}

// Custom Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost"
    size?: "sm" | "md" | "lg"
    isLoading?: boolean
    children: React.ReactNode
}

const Button = ({
    variant = "primary",
    size = "md",
    isLoading = false,
    children,
    className = "",
    disabled,
    ...props
}: ButtonProps) => {
    const baseStyles =
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"

    const variants = {
        primary: "bg-purple-700 text-white hover:bg-purple-800 active:bg-purple-900",
        secondary: "bg-pink-100 text-pink-900 hover:bg-pink-200 active:bg-pink-300",
        outline: "border border-gray-300 bg-transparent hover:bg-gray-100 active:bg-gray-200",
        ghost: "bg-transparent hover:bg-gray-100 active:bg-gray-200",
    }

    const sizes = {
        sm: "text-xs px-3 py-1.5 h-8",
        md: "text-sm px-4 py-2 h-10",
        lg: "text-base px-6 py-3 h-12",
    }

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </button>
    )
}

// Custom Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
}

const Input = ({ label, error, className = "", id, ...props }: InputProps) => {
    return (
        <div className="space-y-2">
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-800">
                    {label}
                </label>
            )}
            <input
                id={id}
                className={`w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500 ${error ? "border-red-500" : ""
                    } ${className}`}
                {...props}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    )
}

// Custom Checkbox Component
interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string
}

const Checkbox = ({ label, id, className = "", ...props }: CheckboxProps) => {
    return (
        <div className="flex items-center space-x-2">
            <div className="relative flex items-center">
                <input
                    type="checkbox"
                    id={id}
                    className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 bg-white checked:border-purple-500 checked:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    {...props}
                />
                <Check className="absolute left-0 top-0 h-4 w-4 text-white opacity-0 peer-checked:opacity-100" />
            </div>
            <label htmlFor={id} className="cursor-pointer text-sm text-gray-800">
                {label}
            </label>
        </div>
    )
}

// Custom Tab Component
interface TabsProps {
    tabs: { id: string; label: string; icon: React.ReactNode }[]
    activeTab: string
    onChange: (id: string) => void
}

const Tabs = ({ tabs, activeTab, onChange }: TabsProps) => {
    return (
        <div className="flex w-full overflow-x-auto justify-start">
            <div className="flex rounded-lg bg-gray-100 p-1.5 shadow-sm">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onChange(tab.id)}
                        className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${activeTab === tab.id
                            ? "bg-white text-purple-700 shadow-sm"
                            : "text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                            }`}
                        aria-selected={activeTab === tab.id}
                        role="tab"
                    >
                        {tab.icon}
                        <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}

// Card component for each upcoming event, with inline registration
interface EventCardProps {
    event: { id: string; eventName: string; about: string }
    onRegisterSuccess: (eventId: string) => void
    variant?: "upcoming" | "participated"
}

const EventCard = ({ event, onRegisterSuccess, variant = "upcoming" }: EventCardProps) => {
    const registerMutation = useRegisterForEvent(event.id)
    const isRegistering = registerMutation.status === "pending"

    const handleRegister = (): void => {
        registerMutation.mutate(undefined, {
            onSuccess: () => {
                toast.success("Successfully registered for the event!")
                onRegisterSuccess(event.id)
            },
            onError: (error: AxiosError<{ message: string }>) => {
                const msg = error.response?.data?.message
                if (msg === "User already joined the activity") {
                    toast.info("You are already registered for this event.")
                } else {
                    toast.error(msg || "Failed to register for the event.")
                }
            },
        })
    }

    return (
        <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-purple-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative z-10">
                <h3 className="mb-2 text-lg font-bold text-gray-900">{event.eventName}</h3>
                <p className="mb-4 text-sm text-gray-600">{event.about}</p>
                {variant === "upcoming" && (
                    <Button onClick={handleRegister} disabled={isRegistering} isLoading={isRegistering} className="w-full">
                        {isRegistering ? "Registering..." : "Register"}
                    </Button>
                )}
                {variant === "participated" && (
                    <div className="flex items-center text-sm text-green-600">
                        <Check className="mr-1 h-4 w-4" />
                        Registered
                    </div>
                )}
            </div>
        </div>
    )
}

// Song card component
interface SongCardProps {
    song: {
        id: string
        songDetails: string
        topic: string | null
        needKaroke: boolean
    }
}

const SongCard = ({ song }: SongCardProps) => {
    return (
        <div className="group relative overflow-hidden rounded-xl bg-white p-6 shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-purple-50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative z-10">
                <h3 className="mb-2 text-lg font-bold text-gray-900">{song.songDetails}</h3>
                <div className="space-y-2">
                    <p className="text-sm text-gray-600">{song.topic ? `Topic: ${song.topic}` : "No topic specified"}</p>
                    <div className="flex items-center text-sm text-gray-600">
                        <span>Karaoke: {song.needKaroke ? "Yes" : "No"}</span>
                    </div>
                </div>
            </div>
            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-purple-500 to-pink-400 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
    )
}

// Empty state component
interface EmptyStateProps {
    icon: React.ReactNode
    message: string
}

const EmptyState = ({ icon, message }: EmptyStateProps) => {
    return (
        <div className="flex flex-col items-center justify-center rounded-xl bg-gray-50 py-12 text-center shadow-sm">
            <div className="mb-4 rounded-full bg-gray-100 p-4">{icon}</div>
            <p className="text-gray-500 font-medium">{message}</p>
        </div>
    )
}

// Modal component for logout confirmation
interface ModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    message: string
    confirmText?: string
    cancelText?: string
}

const Modal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
}: ModalProps) => {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                    aria-label="Close modal"
                >
                    <X className="h-5 w-5" />
                </button>
                <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                <p className="mt-2 text-sm text-gray-600">{message}</p>
                <div className="mt-6 flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose}>
                        {cancelText}
                    </Button>
                    <Button variant="primary" onClick={onConfirm}>
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>
    )
}

const Dashboard = () => {
    // Fetching all events
    const eventsQuery = useApi<GetAllEventsResponse>(HttpMethod.GET, true, "getAllEvents", {
        url: ApiEndpoints.GET_ALL_EVENTS,
    }) as UseQueryResult<GetAllEventsResponse, Error>

    // Fetching the user's activities (joined and added)
    const userActivitiesQuery = useUserActivities()

    // Hook to add a new singing activity
    const addSingingMutation = useAddSinging()

    // Navigation hook
    const navigate = useNavigate()

    // State for the new song form
    const [songForm, setSongForm] = useState<SingingRequest>({
        event: "Singing",
        songDetails: "",
        topic: null,
        needKaroke: false,
    })

    // State to track registered event IDs for triggering refetch
    const [registeredEventId, setRegisteredEventId] = useState<string | null>(null)

    // State for active tab
    const [activeTab, setActiveTab] = useState("upcoming")

    // State for logout modal
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)

    // useEffect to refetch user activities after successful registration
    useEffect(() => {
        if (registeredEventId) {
            userActivitiesQuery.refetch()
            setRegisteredEventId(null) // Reset after refetch
        }
    }, [registeredEventId, userActivitiesQuery])

    // Callback for when registration is successful
    const handleRegisterSuccess = (eventId: string) => {
        setRegisteredEventId(eventId)
    }

    // Handle logout with modal
    const handleLogout = () => {
        setIsLogoutModalOpen(true)
    }

    // Confirm logout
    const confirmLogout = () => {
        localStorageService.removeItem("access_token")
        toast.success("Logged out successfully")
        navigate("/signin")
        setIsLogoutModalOpen(false)
    }

    // Close logout modal
    const closeLogoutModal = () => {
        setIsLogoutModalOpen(false)
    }

    // Handle form input changes for the song form
    const handleSongChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target
        setSongForm((prev) => ({
            ...prev,
            [name]: name === "topic" && value === "" ? null : value,
        }))
    }

    // Handle checkbox change for needKaroke
    const handleKaraokeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setSongForm((prev) => ({
            ...prev,
            needKaroke: e.target.checked,
        }))
    }

    // Handle form submission to add a new song
    const handleAddSong = (e: React.FormEvent<HTMLFormElement>): void => {
        e.preventDefault()
        addSingingMutation.mutate(songForm, {
            onSuccess: (data) => {
                toast.success(`Song "${data.songDetails}" added successfully!`)
                setSongForm({
                    event: "Singing",
                    songDetails: "",
                    topic: null,
                    needKaroke: false,
                })
                userActivitiesQuery.refetch() // Refetch to update addedActivities
            },
            onError: (error: AxiosError<{ message: string }>): void => {
                if (error.response?.status === 401) {
                    toast.error("Unauthorized. Please log in again.")
                } else {
                    toast.error(error.response?.data?.message || "Failed to add song.")
                }
            },
        })
    }

    // Determine if song mutation is in 'loading' state
    const isAddingSong = addSingingMutation.status === "pending"

    // Handle loading state
    if (eventsQuery.isLoading || userActivitiesQuery.isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-purple-500" />
                    <p className="text-gray-500 font-medium">Loading events...</p>
                </div>
            </div>
        )
    }

    // Handle error state
    if (eventsQuery.isError || userActivitiesQuery.isError) {
        console.error("Failed to load events or activities:", eventsQuery.error || userActivitiesQuery.error)
        toast.error("Failed to load events or activities.")
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="rounded-lg bg-red-50 p-6 text-center shadow-sm">
                    <X className="mx-auto mb-4 h-12 w-12 text-red-500" />
                    <p className="text-red-600 font-medium">Error fetching data. Please try again later.</p>
                    <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => {
                            eventsQuery.refetch()
                            userActivitiesQuery.refetch()
                        }}
                    >
                        Try Again
                    </Button>
                </div>
            </div>
        )
    }

    // Create a set of participated event IDs to exclude
    const participatedIds = new Set<string>(userActivitiesQuery.data?.joinedActivities.map((act) => act.event.id) || [])

    // Filter out events that the user has already participated in
    const upcomingEvents = eventsQuery.data?.filter((event) => !participatedIds.has(event.id)) || []

    // Define tabs
    const tabs = [
        {
            id: "upcoming",
            label: "Upcoming Events",
            icon: <CalendarDays className="h-4 w-4" />,
        },
        {
            id: "participated",
            label: "Your Events",
            icon: <Users className="h-4 w-4" />,
        },
        {
            id: "songs",
            label: "Your Songs",
            icon: <Music className="h-4 w-4" />,
        },
    ]

    return (
        <div className="mx-auto max-w-7xl px-4 py-10">
            <div className="relative mb-10 flex justify-center items-center">
                <h1 className="text-4xl font-bold text-gray-900 font-poppins text-center">Event Dashboard</h1>
                <Button
                    variant="secondary"
                    size="md"
                    onClick={handleLogout}
                    className="absolute right-0 gap-2"
                    aria-label="Log out of the application"
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </Button>
            </div>

            <div className="mb-10 flex justify-start">
                <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
            </div>

            {activeTab === "upcoming" && (
                <div className="space-y-8">
                    <div className="flex flex-col items-start gap-2">
                        <h2 className="text-2xl font-semibold text-gray-900 font-poppins">Upcoming Events</h2>
                    </div>
                    {upcomingEvents.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {upcomingEvents.map((event) => (
                                <EventCard key={event.id} event={event} onRegisterSuccess={handleRegisterSuccess} />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={<CalendarDays className="h-8 w-8 text-gray-400" />}
                            message="No upcoming events available."
                        />
                    )}
                </div>
            )}

            {activeTab === "participated" && (
                <div className="space-y-8">
                    <div className="flex flex-col items-start gap-2">
                        <h2 className="text-2xl font-semibold text-gray-900 font-poppins">Your Participated Events</h2>
                    </div>
                    {Array.isArray(userActivitiesQuery.data?.joinedActivities) &&
                        userActivitiesQuery.data.joinedActivities.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {userActivitiesQuery.data.joinedActivities.map((activity) => (
                                <EventCard
                                    key={activity.id}
                                    event={activity.event}
                                    onRegisterSuccess={() => { }}
                                    variant="participated"
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyState icon={<Users className="h-8 w-8 text-gray-400" />} message="No participated events found." />
                    )}
                </div>
            )}

            {activeTab === "songs" && (
                <div className="space-y-8">
                    <div className="flex flex-col items-start gap-2">
                        <h2 className="text-2xl font-semibold text-gray-900 font-poppins">Your Songs</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            {Array.isArray(userActivitiesQuery.data?.addedActivities) &&
                                userActivitiesQuery.data.addedActivities.length > 0 ? (
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    {userActivitiesQuery.data.addedActivities.map((song) => (
                                        <SongCard key={song.id} song={song} />
                                    ))}
                                </div>
                            ) : (
                                <EmptyState icon={<Music className="h-8 w-8 text-gray-400" />} message="No songs added yet." />
                            )}
                        </div>

                        <div>
                            <div className="overflow-hidden rounded-xl bg-white shadow-lg border border-gray-100">
                                <div className="bg-gradient-to-r from-purple-500 to-pink-400 p-6">
                                    <div className="flex items-center gap-2 text-white">
                                        <PlusCircle className="h-5 w-5" />
                                        <h3 className="text-xl font-bold font-poppins">Add a New Song</h3>
                                    </div>
                                    <p className="mt-1 text-sm text-white text-opacity-90 font-roboto">
                                        Fill out the form below to add a new song to your list
                                    </p>
                                </div>
                                <div className="p-6">
                                    <form onSubmit={handleAddSong} className="space-y-4">
                                        <Input
                                            label="Song Details"
                                            id="songDetails"
                                            placeholder="Song name and artist"
                                            name="songDetails"
                                            value={songForm.songDetails}
                                            onChange={handleSongChange}
                                            required
                                        />

                                        <Input
                                            label="Topic (optional)"
                                            id="topic"
                                            placeholder="Song topic or theme"
                                            name="topic"
                                            value={songForm.topic || ""}
                                            onChange={handleSongChange}
                                        />

                                        <Checkbox
                                            id="needKaroke"
                                            label="Need Karaoke?"
                                            checked={songForm.needKaroke}
                                            onChange={handleKaraokeChange}
                                        />

                                        <Button type="submit" isLoading={isAddingSong} className="w-full">
                                            {isAddingSong ? "Adding Song..." : "Add Song"}
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Modal
                isOpen={isLogoutModalOpen}
                onClose={closeLogoutModal}
                onConfirm={confirmLogout}
                title="Confirm Logout"
                message="Are you sure you want to log out? You will need to sign in again to access your dashboard."
                confirmText="Log Out"
                cancelText="Cancel"
            />
        </div>
    )
}

export default Dashboard