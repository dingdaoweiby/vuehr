<template>
  <div>
    <div style="display: flex; justify-content: space-between">
        <el-button icon="el-icon-plus" type="primary" @click="showAddSalaryView">Add Salary Module</el-button>
        <el-button icon="el-icon-refresh" type="success" @click="initSalaries"></el-button>
    </div>
    <div style="margin-top: 10px">
        <el-table :data="salaries" border stripe>
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column width="120" prop="name" label="Module name"></el-table-column>
            <el-table-column width="120" prop="basicSalary" label="Basic Salary"></el-table-column>
            <el-table-column width="120" prop="trafficSalary" label="Traffic Salary"></el-table-column>
            <el-table-column width="120" prop="lunchSalary" label="Lunch Salary"></el-table-column>
            <el-table-column width="70" prop="bonus" label="Bonus"></el-table-column>
            <el-table-column width="120" prop="createDate" label="Create Date"></el-table-column>
            <el-table-column label="401k" align="center">
                <el-table-column width="70" prop="pensionPer" label="Ratio"></el-table-column>
                <el-table-column width="70" prop="pensionBase" label="Base"></el-table-column>
            </el-table-column>
            <el-table-column label="Medical" align="center">
                <el-table-column width="70" prop="medicalPer" label="Ratio"></el-table-column>
                <el-table-column width="70" prop="medicalBase" label="Base"></el-table-column>
            </el-table-column>
            <el-table-column label="Accum Fund" align="center">
                <el-table-column width="70" prop="accumulationFundPer" label="Ratio"></el-table-column>
                <el-table-column width="70" prop="accumulationFundBase" label="Base"></el-table-column>
            </el-table-column>
            <el-table-column label="Operation">
                <template slot-scope="scope">
                    <el-button @click="showEditSalaryView(scope.row)">Edit</el-button>
                    <el-button type="danger" @click="deleteSalary(scope.row)">Delete</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
      <el-dialog
          :title=dialogTitle
          :visible.sync="dialogVisible"
          width="50%">
          <div style="display: flex; justify-content: space-around; align-items: center">
              <el-steps direction="vertical" :active="activeItemIndex">
                  <el-step :title="itemName" v-for="(itemName, index) in salaryItemName" :key="index"></el-step>
              </el-steps>
              <el-input v-model="salary[title]" :placeholder="'Please Add Item : ' + salaryItemName[index] + '...'"
                        v-for="(value,title, index) in
              salary" :key="index" v-show="activeItemIndex === index" style="width: 400px">

              </el-input>
          </div>
          <span slot="footer" class="dialog-footer">
    <el-button @click="preStep">{{ activeItemIndex === 10 ? 'Cancel' : 'Previous' }}</el-button>
    <el-button type="primary" @click="nextStep">{{ activeItemIndex === 10 ? 'Finished' : 'Next' }}</el-button>
  </span>
      </el-dialog>
  </div>
</template>

<script>
    export default {
        name: "SalSob",
        data() {
            return {
                dialogVisible: false,
                dialogTitle: 'Add Salary Module',
                salaries:[],
                activeItemIndex: 0,
                salaryItemName:[
                    'Basic Salary',
                    'Traffic Salary',
                    'Lunch Salary',
                    'Bonus',
                    '401k Ratio',
                    '401k Base',
                    'Medical Ratio',
                    'Medical Base',
                    'Accum Fund Ratio',
                    'Accum Fund Base',
                    'Module Name'
                ],
                salary:{
                    basicSalary:0,
                    trafficSalary:0,
                    lunchSalary:0,
                    bonus:0,
                    pensionPer:0,
                    pensionBase:0,
                    medicalPer:0,
                    medicalBase:0,
                    accumulationFundPer:0,
                    accumulationFundBase:0,
                    name: ''
                }
            }
        },
        mounted() {
            this.initSalaries();
        },
        methods: {
            showEditSalaryView(data) {
                this.dialogTitle = 'Edit Salary Module';
                this.dialogVisible = true;
                this.salary.basicSalary = data.basicSalary;
                this.salary.trafficSalary = data.trafficSalary;
                this.salary.lunchSalary = data.lunchSalary;
                this.salary.bonus = data.bonus;
                this.salary.pensionPer = data.pensionPer;
                this.salary.pensionBase = data.pensionBase;
                this.salary.medicalPer = data.medicalPer;
                this.salary.medicalBase = data.medicalBase;
                this.salary.accumulationFundPer = data.accumulationFundPer;
                this.salary.accumulationFundBasec = data.accumulationFundBase;
                this.salary.name = data.name;
                this.salary.id = data.id;
            },
            deleteSalary(data) {
                this.$confirm('This operation will delete : ' + data.name + ', continue??','hit',{
                    cancelButtonText:'Cancel',
                    confirmButtonText: 'Confirm'
                }).then(()=>{
                    this.deleteRequest("/salary/sob/" + data.id).then(resp=>{
                        if (resp) {
                            this.initSalaries();
                        }
                    })
                }).catch(()=>{
                    this.$message.info("Cancelled Delete")
                });
            },
            preStep() {
                if (this.activeItemIndex === 0) {
                    return;
                } else if (this.activeItemIndex === 10) {

                    //close  dialog
                    this.dialogVisible = false;
                    return;
                }
                this.activeItemIndex--;
            },
            nextStep() {
                if (this.activeItemIndex === 10) {
                    if (this.salary.id) {
                        this.putRequest("/salary/sob/", this.salary).then(resp=>{
                            if (resp) {
                                this.initSalaries();
                                this.dialogVisible = false;
                            }
                        })
                    } else {
                        this.postRequest("/salary/sob/", this.salary).then(resp => {
                            if (resp) {
                                this.initSalaries();
                                this.dialogVisible = false;
                            }
                        });
                    }
                    return;
                }
                this.activeItemIndex++;
            },
            initSalaries() {
                this.getRequest("/salary/sob/").then(resp=>{
                    if (resp) {
                        this.salaries = resp;
                    }
                })
            },
            showAddSalaryView() {
                //initilazt data
                this.salary= {
                    basicSalary:0,
                    trafficSalary:0,
                    lunchSalary:0,
                    bonus:0,
                    pensionPer:0,
                    pensionBase:0,
                    medicalPer:0,
                    medicalBase:0,
                    accumulationFundPer:0,
                    accumulationFundBase:0,
                    name: 'Default Name'
                }
                this.dialogTitle = 'Add Salary Module';
                this.activeItemIndex = 0;
                this.dialogVisible = true;
            }
        }
    }
</script>

<style scoped>

</style>
