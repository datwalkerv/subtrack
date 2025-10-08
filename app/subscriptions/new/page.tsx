import { getSettings } from "@/actions/settingsActions";
import AddSubscriptionPage from "./AddSubscriptionPage";

export default async function AddSubscriptionWrapper(){
    const settings = await getSettings();
    return <AddSubscriptionPage settings={settings?.setting} />
}