import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:healthcare_app/authentication/bloc/authentication_bloc.dart';
import 'package:healthcare_app/utils/index.dart';
import 'package:intl/intl.dart';

class Body extends StatefulWidget {
  Body({Key key}) : super(key: key);
  @override
  _BodyState createState() => _BodyState();
}

class _BodyState extends State<Body> {
  final rowSpacer =
      TableRow(children: [SizedBox(height: 20), SizedBox(height: 20)]);

  String date = DateFormat('dd/MM/yyyy').format(new DateTime.now());

  List<Map<String, dynamic>> show = new List();

  _BodyState() {
    show.add({"date": "123333", "squirm": "222", "weigth": "123213"});
    show.add({"date": "123333", "squirm": "222", "weigth": "123213"});
  }

  @override
  Widget build(BuildContext context) {
    return BlocBuilder<AuthenticationBloc, AuthenticationState>(
        builder: (ctx, state) {
      if (state.user != null) {
        return SingleChildScrollView(
            child: Column(
          children: [
            Container(
              padding: EdgeInsets.all(20),
              margin: EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                border: Border.all(color: Color(0xFFBBC4CE)),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Column(
                children: [
                  Text(
                    'วันที่ : $date',
                    style: TextStyle(
                      fontSize: 20.0,
                    ),
                  ),
                  SizedBox(height: 20),
                  Row(
                    children: [
                      Flexible(
                        child: TextField(
                          textAlign: TextAlign.center,
                          decoration: InputDecoration(
                              contentPadding: EdgeInsets.all(5),
                              focusedBorder: OutlineInputBorder(
                                borderSide: BorderSide(
                                    color: Color(0xFFBBC4CE), width: 1),
                              ),
                              enabledBorder: OutlineInputBorder(
                                borderSide: BorderSide(
                                    color: Color(0xFFBBC4CE), width: 1),
                              ),
                              border: InputBorder.none,
                              hintText: 'จำนวนครั้งที่ลูกดื้น'),
                        ),
                      ),
                      SizedBox(width: 20),
                      Flexible(
                        child: TextField(
                          textAlign: TextAlign.center,
                          decoration: InputDecoration(
                              contentPadding: EdgeInsets.all(5),
                              focusedBorder: OutlineInputBorder(
                                borderSide: BorderSide(
                                    color: Color(0xFFBBC4CE), width: 1),
                              ),
                              enabledBorder: OutlineInputBorder(
                                borderSide: BorderSide(
                                    color: Color(0xFFBBC4CE), width: 1),
                              ),
                              border: InputBorder.none,
                              hintText: 'น้ำหนัก'),
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 20),
                  MaterialButton(
                    onPressed: () {},
                    color: Colors.blue,
                    textColor: Colors.white,
                    child: Text('+',
                        style: TextStyle(fontSize: 36, color: Colors.white)),
                    padding: EdgeInsets.all(10),
                    shape: CircleBorder(),
                  ),
                ],
              ),
            ),
            DataTable(
              headingRowColor:
                  MaterialStateColor.resolveWith((states) => Color(0xff98d583)),
              columns: const <DataColumn>[
                DataColumn(
                  label: Text(
                    'วันที่',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                ),
                DataColumn(
                  label: Text(
                    'จำนวนครั้งที่ดิ้น',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                ),
                DataColumn(
                  label: Text(
                    'น้ำหนักเฉลี่ย',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                  ),
                ),
              ],
              rows: show.map(
                (user) {
                  return DataRow(
                      color: MaterialStateColor.resolveWith((states) {
                        return Colors.white;
                      }),
                      cells: <DataCell>[
                        DataCell(Text('123',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: 16,
                            ))),
                        DataCell(Text('456',
                            textAlign: TextAlign.right,
                            style: TextStyle(
                              fontSize: 16,
                            ))),
                        DataCell(Text('789',
                            textAlign: TextAlign.right,
                            style: TextStyle(
                              fontSize: 16,
                            )))
                      ]);
                },
              ).toList(),
            )
          ],
        ));
      } else {
        return Center(child: CircularProgressIndicator());
      }
    });
  }
}
