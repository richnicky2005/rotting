import { useState, useRef } from "react";
import { api } from "../api";
import { useOutletContext } from "react-router";
import { AuthOutletContext } from "./_user";
import { AutoTable, AutoForm } from "@/components/auto";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, Upload } from "lucide-react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function MedicationsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPhotoOpen, setIsPhotoOpen] = useState(false);
  const [selectedMedicationId, setSelectedMedicationId] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useOutletContext<AuthOutletContext>();

  const handleRowClick = (record: any) => {
    setSelectedMedicationId(record.id);
  };

  const handleCreateSuccess = () => {
    setIsCreateOpen(false);
  };

  const handleUpdateSuccess = () => {
    setIsUpdateOpen(false);
  };

  const handleDeleteSuccess = () => {
    setIsDeleteOpen(false);
    setSelectedMedicationId(null);
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setPhotoFile(file);
    
    // Create a preview URL for the image
    const previewUrl = URL.createObjectURL(file);
    setPhotoPreview(previewUrl);
  };
  
  const handleCapturePhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleProcessPhoto = async () => {
    if (!photoFile) {
      toast.error("Please upload a photo first");
      return;
    }
    
    setIsProcessing(true);
    
    // Simple simulation of photo processing with setTimeout
    setTimeout(async () => {
      try {
        // Mock medication data that would normally come from OCR processing
        const detectedMedication = {
          medication: "Detected Medication 1",
          dosage: "10mg",
          timesPerDay: 2,
          timesToTake: "Morning, Evening",
          user: {
            _link: user?.id // Use the actual user ID from context
          }
        };
        
        // Create the medication using the API
        await api.medication.create(detectedMedication);
        
        // Show success message and reset state
        toast.success(`Added ${detectedMedication.medication}`);
        setIsPhotoOpen(false);
        setPhotoFile(null);
        setPhotoPreview(null);
      } catch (error) {
        console.error("Error creating medication:", error);
        toast.error("Failed to add medication from photo");
      } finally {
        setIsProcessing(false);
      }
    }, 2000); // 2 second simulated processing time
  };

  const resetPhotoState = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Medications</h1>
          <p className="text-muted-foreground">Manage your medication schedule</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isPhotoOpen} onOpenChange={(open) => {
            setIsPhotoOpen(open);
            if (!open) resetPhotoState();
          }}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Camera className="mr-2 h-4 w-4" />
                Add Using Photo
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add Medication from Photo</DialogTitle>
                <DialogDescription>
                  Upload a photo of your medication label or prescription.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="photo">Upload Photo</Label>
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="flex flex-col gap-4 items-center">
                    <Button 
                      type="button" 
                      onClick={handleCapturePhoto}
                      variant="outline"
                      className="w-full"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {photoPreview ? "Change Photo" : "Upload Photo"}
                    </Button>
                    
                    {photoPreview && (
                      <div className="border rounded-md overflow-hidden mt-4 max-h-[300px]">
                        <img 
                          src={photoPreview} 
                          alt="Medication Preview" 
                          className="max-w-full h-auto object-contain"
                        />
                      </div>
                    )}
                    
                    <Button 
                      type="button" 
                      onClick={handleProcessPhoto}
                      disabled={!photoFile || isProcessing}
                      className="mt-4 w-full"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Process Photo"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>Add Medication</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Medication</DialogTitle>
                <DialogDescription>
                  Enter the details for your new medication.
                </DialogDescription>
              </DialogHeader>
              <AutoForm 
                action={api.medication.create} 
                onSuccess={handleCreateSuccess}
                include={["medication", "dosage", "timesPerDay", "timesToTake"]}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Separator className="my-6" />

      <Card>
        <CardHeader>
          <CardTitle>Your Medications</CardTitle>
          <CardDescription>
            View and manage your prescribed medications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AutoTable 
            model={api.medication} 
            columns={[
              "medication", 
              "dosage", 
              "timesPerDay", 
              "timesToTake",
              {
                header: "Actions",
                render: ({ record }) => (
                  <div className="flex space-x-2">
                    <Dialog open={isUpdateOpen && selectedMedicationId === record.id} onOpenChange={(open) => {
                      setIsUpdateOpen(open);
                      if (open) setSelectedMedicationId(record.id);
                    }}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">Edit</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>Edit Medication</DialogTitle>
                          <DialogDescription>
                            Update your medication details.
                          </DialogDescription>
                        </DialogHeader>
                        <AutoForm 
                          action={api.medication.update} 
                          findBy={record.id}
                          onSuccess={handleUpdateSuccess}
                          include={["medication", "dosage", "timesPerDay", "timesToTake"]}
                        />
                      </DialogContent>
                    </Dialog>
                    
                    <Dialog open={isDeleteOpen && selectedMedicationId === record.id} onOpenChange={(open) => {
                      setIsDeleteOpen(open);
                      if (open) setSelectedMedicationId(record.id);
                    }}>
                      <DialogTrigger asChild>
                        <Button variant="destructive" size="sm">Delete</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                          <DialogTitle>Delete Medication</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete this medication? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <AutoForm 
                          action={api.medication.delete} 
                          findBy={record.id}
                          onSuccess={handleDeleteSuccess}
                        />
                      </DialogContent>
                    </Dialog>
                  </div>
                )
              }
            ]}
            onClick={handleRowClick}
          />
        </CardContent>
      </Card>
    </div>
  );
}