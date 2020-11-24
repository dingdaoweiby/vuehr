<template>
  <div>
    <div>
        <el-table :data="emps" border stripe size="mini">
            <el-table-column type="selection" align="left" width="55"></el-table-column>
            <el-table-column prop="name" label="Name" fixed width="120" align="left"></el-table-column>
            <el-table-column prop="workID" label="Work Id" width="120" align="left"></el-table-column>
            <el-table-column prop="email" label="Email" width="200" align="left"></el-table-column>
            <el-table-column prop="phone" label="Phone" width="120" align="left"></el-table-column>
            <el-table-column prop="department.name" label="Department1" width="120" align="left"></el-table-column>
            <el-table-column label="Department1" align="center">
                <template slot-scope="scope">
                    <el-tooltip placement="right" v-if="scope.row.salary">
                        <div slot="content">
                            <table>
                                <tr>
                                    <td>Basic Salary</td>
                                    <td>{{scope.row.salary.basicSalary}}</td>
                                </tr>
                                <tr>
                                    <td>Traffic Salary</td>
                                    <td>{{scope.row.salary.trafficSalary}}</td>
                                </tr>
                                <tr>
                                    <td>Lunch Salary</td>
                                    <td>{{scope.row.salary.lunchSalary}}</td>
                                </tr>
                                <tr>
                                    <td>Bonus</td>
                                    <td>{{scope.row.salary.bonus}}</td>
                                </tr>
                                <tr>
                                    <td>401k Ratio</td>
                                    <td>{{scope.row.salary.pensionPer}}</td>
                                </tr>
                                <tr>
                                    <td>401k Base</td>
                                    <td>{{scope.row.salary.pensionBase}}</td>
                                </tr>
                                <tr>
                                    <td>Medical Ratio</td>
                                    <td>{{scope.row.salary.medicalPer}}</td>
                                </tr>
                                <tr>
                                    <td>Medical Base</td>
                                    <td>{{scope.row.salary.medicalBase}}</td>
                                </tr>
                                <tr>
                                    <td>Accum Fund Ratio</td>
                                    <td>{{scope.row.salary.accumulationFundPer}}</td>
                                </tr>
                                <tr>
                                    <td>Accum Fund Base</td>
                                    <td>{{scope.row.salary.accumulationFundBase}}</td>
                                </tr>
                                <tr>
                                    <td>Create Date</td>
                                    <td>{{scope.row.salary.createDate}}</td>
                                </tr>
                            </table>
                        </div>
                        <el-tag>{{scope.row.salary.name}}</el-tag>
                    </el-tooltip>
                    <el-tag v-else>No Salary Data</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="Operation" align="center">
                <template slot-scope="scope">
                    <el-popover
                        placement="left"
                        title="Edit Salary Module"
                        @show="showPop(scope.row.salary)"
                        @hide="hidePop(scope.row)"
                        width="200"
                        trigger="click">
                        <div>
                            <el-select v-model="currentSalary" placeholder="请选择" size="mini">
                                <el-option
                                    v-for="item in salaries"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                        <el-button slot="reference" type="danger">Edit Salary Module</el-button>
                    </el-popover>
                </template>
            </el-table-column>
        </el-table>
        <div style="display: flex;justify-content: flex-end">
            <el-pagination
                background
                @size-change="sizeChange"
                @current-change="currentChange"
                layout="sizes, prev, pager, next, jumper, ->, total, slot"
                :total="total">
            </el-pagination>
        </div>
    </div>
  </div>
</template>

<script>
export default {
    name: "SalSobCfg",
    data() {
        return {
            emps:[],
            total:0,
            currentPage:1,
            currentSize: 10,
            currentSalary: null,
            salaries:[]
        }
    },
    mounted() {
        this.initEmps();
        this.initSalaries();
    },
    methods:{
        currentChange(page) {
            this.currentPage=page;
            this.initEmps();
        },
        sizeChange(size) {
            this.currentSize = size;
            this.initEmps();
        },
        hidePop(data) {
            if (this.currentSalary) {
                this.putRequest('/salary/sobcfg/?eid='+data.id+'&sid='+this.currentSalary).then(resp => {
                    if (resp) {
                        this.initEmps();
                    }
                });
            }
        },
        showPop(data) {
            if (data) {
                this.currentSalary = data.id;
            } else {
                this.currentSalary = null;
            }
        },
        initSalaries() {
            this.getRequest("/salary/sobcfg/salaries/").then(resp => {
                if (resp) {
                    this.salaries = resp;
                }
            });
        },
        initEmps(){
            this.getRequest("/salary/sobcfg/?page="+this.currentPage+"&size="+this.currentSize).then(resp=>{
                if (resp) {
                    this.emps = resp.data;
                    this.total=resp.total;
                }
            })
        }
    }
}
</script>

<style scoped>

</style>
